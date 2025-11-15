"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Carrera, Materia } from "@/lib/Tipos/tipos";

export function AltaComisionModal({ sedes }) {
  const [open, setOpen] = React.useState(false);

  const [nombre, setNombre] = React.useState("");
  const [anioDictado, setAnioDictado] = React.useState(
    new Date().getFullYear()
  );
  const [inscriptos, setInscriptos] = React.useState<number | "">("");
  const [profesor, setProfesor] = React.useState("");

  const [dia, setDia] = React.useState<number | "">("");
  const [turno, setTurno] = React.useState<number | "">("");

  const [sedeId, setSedeId] = React.useState("");
  const [carreras, setCarreras] = React.useState<Carrera[]>([]);
  const [carreraIds, setCarreraIds] = React.useState<string[]>([]);

  const [materias, setMaterias] = React.useState<Materia[]>([]);
  const [materiaIds, setMateriaIds] = React.useState<string[]>([]);

  const [loading, setLoading] = React.useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // ------ FETCH DINÁMICO ------
  React.useEffect(() => {
    if (!sedeId) {
      setCarreras([]);
      setCarreraIds([]);
      return;
    }

    fetch(`/api/carreras?sede=${sedeId}`)
      .then((r) => r.json())
      .then((data) => setCarreras(data || []));
  }, [sedeId]);

  React.useEffect(() => {
    if (!carreraIds.length) {
      setMaterias([]);
      setMateriaIds([]);
      return;
    }

    fetch(`/api/materias?carreras=${carreraIds.join(",")}`)
      .then((r) => r.json())
      .then((data) => setMaterias(data || []));
  }, [carreraIds]);

  const resetForm = () => {
    setNombre("");
    setProfesor("");
    setInscriptos("");
    setDia("");
    setTurno("");
    setSedeId("");
    setCarreraIds([]);
    setMateriaIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !anioDictado ||
      !dia ||
      !turno ||
      !sedeId ||
      carreraIds.length === 0 ||
      materiaIds.length === 0
    ) {
      toast({
        title: "Error",
        description: "Todos los campos obligatorios deben completarse.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nombre_comision: nombre,
        anio_dictado: Number(anioDictado),
        inscriptos: Number(inscriptos) || 0,
        profesor,
        horario: { dia: Number(dia), turno: Number(turno) },
        sede_id: sedeId,
        carrera_ids: carreraIds,
        materia_ids: materiaIds,
      };

      const res = await fetch("/api/comisiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "No se pudo crear la comisión");
      }

      toast({
        title: "Comisión creada",
        description: `La comisión "${nombre}" fue creada correctamente.`,
      });

      resetForm();
      router.refresh();
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Nueva Comisión
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nueva comisión</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          {/* NOMBRE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre *</label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          {/* AÑO */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Año de dictado *</label>
            <Input
              type="number"
              value={anioDictado}
              onChange={(e) => setAnioDictado(e.target.valueAsNumber)}
            />
          </div>

          {/* INSCRIPTOS */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Inscriptos</label>
            <Input
              type="number"
              value={inscriptos}
              onChange={(e) =>
                setInscriptos(
                  e.target.value === "" ? "" : e.target.valueAsNumber
                )
              }
            />
          </div>

          {/* PROFESOR */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Profesor</label>
            <Input
              value={profesor}
              onChange={(e) => setProfesor(e.target.value)}
            />
          </div>

          {/* DÍA */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Día *</label>
            <select
              className="border rounded-md p-2"
              value={dia}
              onChange={(e) => setDia(Number(e.target.value))}
            >
              <option value="">Seleccionar día...</option>
              <option value={1}>Lunes</option>
              <option value={2}>Martes</option>
              <option value={3}>Miércoles</option>
              <option value={4}>Jueves</option>
              <option value={5}>Viernes</option>
              <option value={6}>Sábado</option>
            </select>
          </div>

          {/* TURNO */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Turno *</label>
            <select
              className="border rounded-md p-2"
              value={turno}
              onChange={(e) => setTurno(Number(e.target.value))}
            >
              <option value="">Seleccionar turno...</option>
              <option value={1}>Mañana</option>
              <option value={2}>Tarde</option>
              <option value={3}>Noche</option>
            </select>
          </div>

          {/* SEDE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Sede *</label>
            <select
              className="border rounded-md p-2"
              value={sedeId}
              onChange={(e) => setSedeId(e.target.value)}
            >
              <option value="">Seleccionar sede...</option>
              {sedes.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* CARRERAS */}
          {carreras.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Carreras *</label>
              <select
                multiple
                className="border rounded-md p-2 h-28"
                value={carreraIds}
                onChange={(e) =>
                  setCarreraIds(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
              >
                {carreras.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre_carrera}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* MATERIAS */}
          {materias.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Materias *</label>
              <select
                multiple
                className="border rounded-md p-2 h-28"
                value={materiaIds}
                onChange={(e) =>
                  setMateriaIds(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
              >
                {materias.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.nombre_materia}
                  </option>
                ))}
              </select>
            </div>
          )}

          <DialogFooter className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
