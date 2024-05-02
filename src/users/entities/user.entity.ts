import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @ApiProperty()
    @Column({
        length:'60',
        unique: true,
    })
    email: string;

    @ApiProperty()
    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty()
    @Column('bool', {
        default:true
    })
    isActive: boolean;

    @ApiProperty()
    @Column('text')
    firstname: string;

    @ApiProperty()
    @Column('text')
    lastname: string;

    @ApiProperty()
    @Column({
        type: 'varchar', 
        length: 50, 
        default: 'Regular' 
    })
    role: string;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default:null })
    deletedAt: Date;


    @BeforeInsert()
    checkEmailBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailBeforeUpdate(){
        this.checkEmailBeforeInsert();
    }

}
