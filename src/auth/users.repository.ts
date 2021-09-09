import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private readonly logger = new Logger(UsersRepository.name);

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    //hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    let result;
    try {
      result = await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error('Username is already exist', error.stack);
        throw new ConflictException('Username is already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return result;
  }
}
