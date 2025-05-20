"use strict";
import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
    name: "User",
    tableName: "usuarios",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        nombres: {
            type: "simple-array",
            nullable: true,
            name: "nombres_pila",
        },
        apellidos: {
            type: "simple-array",
            nullable: true,
            name: "apellidos",
        },
        rut: {
            type: "varchar",
            length: 12,
            nullable: false,
            unique: true,
        },
        fechaNacimiento: {
            type: "date",
            nullable: true,
            name: "fecha_nacimiento",
        },
        email: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        telefono: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
        hashedPassword: {
            type: "varchar",
            length: 255,
            nullable: false,
            name: "hashed_password",
        },
        activo: {
            type: "boolean",
            default: true,
            name: "activo",
        },
        createdAt: {
            type: "timestamp with time zone",
            createDate: true,
            name: "fecha_creacion",
        },
        updatedAt: {
            type: "timestamp with time zone",
            updateDate: true,
            name: "fecha_actualizacion",
        },
    },
    indices: [
        {
            name: "IDX_USUARIOS_RUT",
            columns: ["rut"],
            unique: true,
        },
        {
            name: "IDX_USUARIOS_EMAIL",
            columns: ["email"],
            unique: true,
        },
    ],

    relations: {
        roles: {
            type: "many-to-many",
            target: "Role",
            joinTable: {
                name: "usuario_roles",
                joinColumn: {
                    name: "usuario_id",
                    referencedColumnName: "id",
                    onDelete: "CASCADE",
                },
                inverseJoinColumn: {
                    name: "rol_id",
                    referencedColumnName: "id",
                    onDelete: "CASCADE",
                },
            },
            eager: true,
        },
    },
});

export default UserSchema;