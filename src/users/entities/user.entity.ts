import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ValidRoles } from "src/auth/interfaces/valid-roles";

@Entity('users')
export class User {
    @ApiProperty({
        example:"7c65cc7e-2c7a-424d-9cec-81cf334672fd",
        description: "User ID",
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @ApiProperty({
        example:"nicolas.moran@gmail.com",
        description: "User Email",
        uniqueItems:true
    })
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
        type: 'enum',
        enum: ValidRoles, 
        default: ValidRoles.regular 
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
