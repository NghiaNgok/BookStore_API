import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';

import { SignUpDto } from 'src/dtos/auth/signup.dto';
import { AuthRepository } from './auth.repository';
import { UserEntity } from 'src/entities/user.entity';
import {
  hashPassword,
  comparePassword,
} from 'src/shared/utils/hashPassword.util';
import { SignInDto } from 'src/dtos/auth/signin.dto';
import { SignInResponseDto } from 'src/dtos/auth/signin-response.dto';
import { TokenPayload } from 'src/dtos/auth/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}
  async getAuthenticatedUser(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.authRepository.findOne({ username });
    if (!user) {
      throw new BadRequestException('user is not existed');
    }
    if (!user.isActive) {
      throw new BadRequestException('This account has been blocked');
    }
    await this.verifyPlainContentWithHashedContent(password, user.password);
    return plainToInstance(UserEntity, user);
  }

  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = await comparePassword(plain_text, hashed_text);
    if (!is_matching) {
      throw new BadRequestException('Password is incorrect');
    }
  }

  generateAccessToken(payload: TokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: "your_jwt_access_token_secret_here",
      expiresIn: 1000000,
    });
    console.log(token)
    if (!token) {
      throw new BadRequestException('Failed to verify token');
    }
    return token;
  }

  generateRefreshToken(payload: TokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    if (!token) {
      throw new BadRequestException('Failed to verify token');
    }
    return token;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(refreshToken);
      const user = await this.authRepository.findOne({
        username: payload.username,
      });
      if (!user) {
        throw new BadRequestException();
      }

      const newPayload = { username: user.username, sub: user.id };
      const accessToken = this.generateAccessToken(newPayload);
      const result = plainToInstance(SignInResponseDto, {
        accessToken,
        userInfo: user,
      });
      return result;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async signin(signinDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.getAuthenticatedUser(
      signinDto.username,
      signinDto.password,
    );
    let refresh_token = null;
    if (!user.refreshToken) {
      refresh_token = this.generateRefreshToken({
        sub: user.id,
        username: user.username,
      });
      await this.authRepository.updateRefreshToken(
        user.username,
        refresh_token,
      );
    } else {
      refresh_token = user.refreshToken;
    }
    const payload = {
      sub: user.id,
      username: user.username,
    };
    // create access token
    const accessToken = this.generateAccessToken(payload);
    const result = plainToInstance(SignInResponseDto, {
      accessToken,
      refreshToken: refresh_token,
      userInfo: user,
    });
    return result;
  }

  async validateAdmin(username: string, pass: string): Promise<any> {
    const admin = await this.authRepository.findOneAdmin({ username });
    if (!admin) {
      throw new BadRequestException('User name invalid');
    }
    await this.verifyPlainContentWithHashedContent(pass, admin.password);
    const { password, ...result } = admin;
    return result;
  }

  async signinAdmin(
    username: string,
    passwsord: string,
  ): Promise<SignInResponseDto> {
    const admin = await this.validateAdmin(username, passwsord);

    const payload = {
      sub: admin.id,
      username: admin.username,
      role: 'admin',
    };
    // create access token
    const accessToken = this.generateAccessToken(payload);

    const result = plainToInstance(SignInResponseDto, {
      accessToken,
      userInfo: admin,
    });
    return result;
  }

  async signup(signupDto: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await hashPassword(signupDto.password);
    const result = await this.authRepository.signup({
      data: {
        fullName: signupDto.fullName,
        address: signupDto.address,
        phoneNumber: signupDto.phoneNumber,
        email: signupDto.email,
        username: signupDto.username,
        password: hashedPassword,
        avatar: signupDto.avatar,
      },
    });
    return plainToInstance(UserEntity, result);
  }

  async logout(uid: string): Promise<UserEntity> {
    try {
      const user = await this.authRepository.findOne({
        id: uid,
      });
      if (!user) {
        throw new BadRequestException();
      }
      const result = await this.authRepository.updateRefreshToken(
        user.username,
        null,
      );
      if (!result) throw new BadRequestException();
      return plainToInstance(UserEntity, result);
    } catch (e) {
      console.log('errr', e);
      throw new BadRequestException();
    }
  }
}
