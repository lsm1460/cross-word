import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  contentId: number;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  nickname: string;

  @Column()
  playDuration: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
