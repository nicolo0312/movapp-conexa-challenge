import { ApiProperty } from "@nestjs/swagger";
import { AfterInsert, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('movies')
export class Movie {

    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string; 
    @Column({
        length:'200',
        unique: true,
    })
    title: string;

    @ApiProperty()
    @Column('text')
    description: string;

    @ApiProperty()
    @Column({
        type: 'timestamp',
        nullable:true
    })
    releaseDate:Date;

    @ApiProperty()
    @Column('int',{
        nullable:true
    })
    runtime:number;

    @ApiProperty()
    @Column('text',{
        nullable:true
    })
    genre:string;

    @ApiProperty()
    @Column('bool', {
        default:true
    })
    isActive: boolean;

    @ApiProperty()
    @Column('text',{
        nullable:true
    })
    flatten:string;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ApiProperty()
    @Column({ type: 'timestamp', default:null })
    deletedAt: Date;

    @AfterInsert()
    insertFlatten(){
        this.flatten = `${this.title} ${this.genre}`
    }

    @AfterUpdate()
    updateFlatten(){
        this.insertFlatten()
    }



}
