import React, { useEffect, useState } from 'react';
import {
    AlertCircle,
    Briefcase,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Eye,
    Mail,
    Phone,
    UserCircle,
    GraduationCap,
    IdCard,
} from 'lucide-react';

import { listarPostulacionesGerente } from '../../services/postulacionService';

import type { PostulacionGerente } from '../../services/postulacionService';

interface Aviso {
    tipo: 'success' | 'error' | 'warning';
    mensaje: string;
}

export const PostulacionesPanel: React.FC = () => {
    const [postulaciones, setPostulaciones] = useState<PostulacionGerente[]>([]);
    const [cargando, setCargando] = useState(true);
    const [aviso, setAviso] = useState<Aviso | null>(null);

    const cargarPostulaciones = async () => {
        setCargando(true);
        setAviso(null);

        try {
            const data = await listarPostulacionesGerente();
            setPostulaciones(data.postulaciones || []);
        } catch (error: any) {
            setAviso({
                tipo: 'error',
                mensaje:
                    error.message ||
                    'No se pudieron cargar las postulaciones. Verifica que tengas una empresa registrada.',
            });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPostulaciones();
    }, []);

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-institucional-blue font-semibold animate-pulse">
                    Cargando postulaciones...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {aviso && <AvisoTailwind aviso={aviso} />}

            <div>
                <h2 className="text-2xl font-montserrat font-bold text-institucional-blue">
                    Postulaciones
                </h2>
                <p className="text-sm text-medium-gray">
                    Lista de pasantes inscritos a las pasantías de tu empresa.
                </p>
            </div>

            {postulaciones.length === 0 ? (
                <div className="bg-white-main p-8 rounded-xl shadow-sm border border-light-gray">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="text-medium-gray" size={38} />

                        <div>
                            <h3 className="text-lg font-bold text-dark-gray">
                                No hay pasantes inscritos
                            </h3>
                            <p className="text-sm text-medium-gray">
                                Cuando un pasante se inscriba a una pasantía de tu empresa,
                                aparecerá en esta sección.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {postulaciones.map((postulacion) => (
                        <div
                            key={postulacion.id_boleta}
                            className="bg-white-main p-6 rounded-xl shadow-sm border border-light-gray"
                        >
                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                                <div className="space-y-5 flex-1">
                                    <div className="flex items-start gap-3">
                                        <UserCircle
                                            className="text-main-green mt-1 shrink-0"
                                            size={34}
                                        />

                                        <div>
                                            <h3 className="text-lg font-bold text-institucional-blue">
                                                {postulacion.pasante?.usuario?.nombre}{' '}
                                                {postulacion.pasante?.usuario?.apellido}
                                            </h3>

                                            <p className="text-sm text-medium-gray">
                                                Inscrito el {postulacion.fecha}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                        <DatoPostulacion
                                            icono={<Mail size={16} />}
                                            label="Correo"
                                            valor={postulacion.pasante?.usuario?.email || 'Sin correo'}
                                        />

                                        <DatoPostulacion
                                            icono={<Phone size={16} />}
                                            label="Teléfono"
                                            valor={
                                                postulacion.pasante?.telefono ||
                                                postulacion.pasante?.usuario?.telefono ||
                                                'Sin teléfono'
                                            }
                                        />

                                        <DatoPostulacion
                                            icono={<GraduationCap size={16} />}
                                            label="Registro Univ."
                                            valor={
                                                postulacion.pasante?.reg_universitario ||
                                                'No registrado'
                                            }
                                        />

                                        <DatoPostulacion
                                            icono={<IdCard size={16} />}
                                            label="CI"
                                            valor={postulacion.pasante?.ci || 'No registrado'}
                                        />
                                    </div>

                                    <div className="bg-light-gray/40 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="text-secondary-blue mt-1" size={24} />

                                            <div>
                                                <p className="font-bold text-dark-gray">
                                                    {postulacion.pasantia?.nombre}
                                                </p>

                                                <p className="text-sm text-medium-gray mt-1">
                                                    {postulacion.pasantia?.descripcion}
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                                    <DatoSimple
                                                        icono={<Calendar size={15} />}
                                                        label="Inicio"
                                                        valor={postulacion.pasantia?.fecha_inicio}
                                                    />

                                                    <DatoSimple
                                                        icono={<Calendar size={15} />}
                                                        label="Fin"
                                                        valor={postulacion.pasantia?.fecha_fin}
                                                    />

                                                    <DatoSimple
                                                        icono={<CheckCircle2 size={15} />}
                                                        label="Horario"
                                                        valor={postulacion.pasantia?.horario}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {postulacion.descripcion && (
                                        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm">
                                            <strong>Descripción de inscripción:</strong>{' '}
                                            {postulacion.descripcion}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-[170px] flex xl:flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log(
                                                'Ver progreso de boleta:',
                                                postulacion.id_boleta
                                            );
                                        }}
                                        className="bg-secondary-blue hover:bg-institucional-blue text-white-main font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Eye size={17} />
                                        Progreso
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface DatoPostulacionProps {
    icono: React.ReactNode;
    label: string;
    valor: string;
}

const DatoPostulacion: React.FC<DatoPostulacionProps> = ({
    icono,
    label,
    valor,
}) => {
    return (
        <div className="bg-light-gray/40 rounded-xl px-4 py-3">
            <p className="text-xs text-medium-gray font-semibold flex items-center gap-1">
                {icono}
                {label}
            </p>

            <p className="font-bold text-dark-gray mt-1 break-words">{valor}</p>
        </div>
    );
};

interface DatoSimpleProps {
    icono: React.ReactNode;
    label: string;
    valor?: string;
}

const DatoSimple: React.FC<DatoSimpleProps> = ({ icono, label, valor }) => {
    return (
        <div>
            <p className="text-xs text-medium-gray font-semibold flex items-center gap-1">
                {icono}
                {label}
            </p>

            <p className="text-sm font-bold text-dark-gray mt-1">
                {valor || 'No registrado'}
            </p>
        </div>
    );
};

const AvisoTailwind: React.FC<{ aviso: Aviso }> = ({ aviso }) => {
    const estilos = {
        success: 'bg-green-100 text-green-700 border-green-200',
        error: 'bg-red-100 text-red-700 border-red-200',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    const Icon = aviso.tipo === 'success' ? CheckCircle2 : AlertCircle;

    return (
        <div
            className={`border px-4 py-3 rounded-xl text-sm flex gap-2 items-start ${estilos[aviso.tipo]}`}
        >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p>{aviso.mensaje}</p>
        </div>
    );
};