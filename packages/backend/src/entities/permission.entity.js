// src/entities/Permission.schema.js
"use strict";
import { EntitySchema } from "typeorm";

const PermissionSchema = new EntitySchema({
    name: "Permission",
    tableName: "permisos",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: "increment",
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true,
        },
        descripcion: {
            type: "text",
            nullable: true,
        },
        createdAt: {
            type: "timestamp with time zone",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp with time zone",
            updateDate: true,
        },
    },
    relations: {
        roles: {
            type: "many-to-many",
            target: "Role",
            mappedBy: "permisos",
        },
    },
    indices: [
        {
            name: "IDX_PERMISOS_NOMBRE_PERMISO_UNICO",
            columns: ["nombre"],
            unique: true,
        },
    ],
});

export default PermissionSchema;
