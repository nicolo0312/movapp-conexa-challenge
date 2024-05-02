import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string; 
    @Column({
        length:'60',
        unique: true,
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('bool', {
        default:true
    })
    isActive: boolean;

    @Column('text')
    firstname: string;

    @Column('text')
    lastname: string;

    @Column({
        type: 'varchar', // Cambiar a tipo VARCHAR
        length: 50, // Ajustar la longitud según sea necesario
        default: 'Regular' // Establecer el valor predeterminado
    })
    role: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

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
