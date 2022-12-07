import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Create {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  nickname: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  board: string;

  @Column({ type: 'text', nullable: false })
  gameData: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
