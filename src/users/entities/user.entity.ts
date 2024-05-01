import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string; 
    @Column({
        length:'60',
        unique: true,
    })
    email: string;

    @Column('text')
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

}
