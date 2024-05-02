import { AfterInsert, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn('uuid')
    id: string; 
    @Column({
        length:'200',
        unique: true,
    })
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'timestamp',
        nullable:true
    })
    releaseDate:Date;

    @Column('int',{
        nullable:true
    })
    runtime:number;

    @Column('text',{
        nullable:true
    })
    genre:string;

    @Column('bool', {
        default:true
    })
    isActive: boolean;

    @Column('text',{
        nullable:true
    })
    flatten:string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

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
