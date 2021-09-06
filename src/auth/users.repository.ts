import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private readonly logger = new Logger(UsersRepository.name);

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = this.create({
      username,
      password,
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
