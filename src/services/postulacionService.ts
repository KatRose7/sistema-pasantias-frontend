const API_URL = import.meta.env.VITE_API_URL;

export interface PostulacionGerente {
    id_boleta: number;
    fecha: string;
    descripcion: string | null;

    pasante: {
        id_pasante: number;
        ci: string;
        reg_universitario: string;
        direccion: string;
        telefono: string;
        usuario: {
            id_usuario: number;
            nombre: string;
            apellido: string;
            email: string;
            telefono: string;
        };
    };

    pasantia: {
        id_pasantia: number;
        nombre: string;
        descripcion: string;
        fecha_inicio: string;
        fecha_fin: string;
        horario: string;
        estado: string;
    };

    jefe: {
        id_usuario: number;
        cargo: string;
        telefono: string;
        usuario: {
            nombre: string;
            apellido: string;
            email: string;
        };
    };
}

const getJsonHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

const manejarRespuesta = async (response: Response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw data || { message: 'Error en la petición.' };
    }

    return data;
};

export const listarPostulacionesGerente = async () => {
    const response = await fetch(`${API_URL}/gerente/postulaciones`, {
        method: 'GET',
        headers: getJsonHeaders(),
    });

    return manejarRespuesta(response);
};