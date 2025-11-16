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
import { AulaRecursos, Carrera, Materia } from "@/lib/Tipos/tipos";
import { Pencil } from "lucide-react";

export function EditarComisionModal({ comision, sedes }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // ---------- ESTADOS ----------
  const [nombre, setNombre] = React.useState(comision.nombre_comision);
  const [anioDictado, setAnioDictado] = React.useState(comision.anio_dictado);
  const [inscriptos, setInscriptos] = React.useState<number | "">(
    comision.inscriptos || ""
  );
  const [profesor, setProfesor] = React.useState(comision.profesor || "");

  const [dia, setDia] = React.useState(comision.horario.dia);
  const [turno, setTurno] = React.useState(comision.horario.turno);
  const [cuatrimestre, setCuatrimestre] = React.useState(
    comision.horario.cuatrimestre
  );

  const [sedeId, setSedeId] = React.useState(comision.sede_id);

  const [carreras, setCarreras] = React.useState<Carrera[]>([]);
  const [carreraIds, setCarreraIds] = React.useState<string[]>(
    comision.carrera_ids.map((c) => c._id.toString())
  );

  const [materias, setMaterias] = React.useState<Materia[]>([]);
  const [materiaIds, setMateriaIds] = React.useState<string[]>(
    comision.materia_ids.map((m) => m._id.toString())
  );

  const [recursos, setRecursos] = React.useState<string[]>(
    comision.recursos || []
  );

  const [loading, setLoading] = React.useState(false);

  // ---------- FETCH DE CARRERAS ----------
  React.useEffect(() => {
    if (!sedeId) return;

    fetch(`/api/carreras?sedeId=${sedeId}`)
      .then((res) => res.json())
      .then((data) => setCarreras(data));
  }, [sedeId]);

  // ---------- FETCH DE MATERIAS ----------
  React.useEffect(() => {
    if (carreraIds.length === 0 || !cuatrimestre) {
      setMaterias([]);
      return;
    }

    const queryCarreras = carreraIds.map((id) => `carreraId=${id}`).join("&");

    fetch(`/api/materias?${queryCarreras}&cuatrimestre=${cuatrimestre}`)
      .then((res) => res.json())
      .then((data) => setMaterias(data));
  }, [carreraIds, cuatrimestre]);

  // ---------- HANDLE SUBMIT ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nombre_comision: nombre,
      anio_dictado: Number(anioDictado),
      inscriptos: Number(inscriptos) || 0,
      profesor,
      horario: { dia, turno, cuatrimestre },
      sede_id: sedeId,
      carrera_ids: carreraIds,
      materia_ids: materiaIds,
      recursos,
    };

    try {
      const res = await fetch(`/api/comisiones/${comision._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("No se pudo actualizar la comisión.");

      toast({
        title: "Comisión actualizada",
        description: `La comisión "${nombre}" fue modificada correctamente.`,
      });

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

  // ---------- UI ----------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil className="w-4 h-4" />
      </Button>

      <DialogContent className="sm:max-w-md max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar comisión</DialogTitle>
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

          {/* CUATRIMESTRE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Cuatrimestre *</label>
            <select
              className="border rounded-md p-2"
              value={cuatrimestre}
              onChange={(e) => setCuatrimestre(Number(e.target.value))}
            >
              <option value="">Seleccionar cuatrimestre...</option>
              <option value={1}>1° Cuatrimestre</option>
              <option value={2}>2° Cuatrimestre</option>
              <option value={3}>Anual</option>
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

              <div className="flex flex-col flex-wrap gap-2 bg-sidebar p-2 rounded-md border border-input max-h-48 overflow-auto">
                {carreras.map((carrera) => {
                  const id = carrera._id.toString();
                  const checked = carreraIds.includes(id);

                  return (
                    <label
                      key={id}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        className="peer hidden"
                        value={id}
                        checked={checked}
                        onChange={() => {
                          setCarreraIds((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          );
                        }}
                      />

                      {/* CHECKBOX VISUAL */}
                      <span
                        className="w-5 h-5 rounded border border-input bg-background 
              flex-shrink-0 flex items-center justify-center
              peer-checked:bg-primary peer-checked:border-primary
              transition-colors"
                      >
                        <svg
                          className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>

                      <span>{carrera.nombre_carrera}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* MATERIAS */}
          {materias.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Materias *</label>

              <div className="flex flex-col flex-wrap gap-2 bg-sidebar p-2 rounded-md border border-input max-h-48 overflow-auto">
                {materias.map((materia) => {
                  const id = materia._id.toString();
                  const checked = materiaIds.includes(id);

                  return (
                    <label
                      key={id}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      {/* CHECKBOX REAL (oculto) */}
                      <input
                        type="checkbox"
                        className="peer hidden"
                        value={id}
                        checked={checked}
                        onChange={() => {
                          setMateriaIds((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          );
                        }}
                      />

                      {/* CHECKBOX VISUAL */}
                      <span
                        className="w-5 h-5 rounded border border-input bg-background 
                flex-shrink-0 flex items-center justify-center
                peer-checked:bg-primary peer-checked:border-primary
                transition-colors"
                      >
                        <svg
                          className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>

                      <span>{materia.nombre_materia}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Recursos</label>
            <div className="flex flex-col flex-wrap gap-2 bg-sidebar p-2 rounded-md border border-input">
              {AulaRecursos.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={recursos.includes(r)}
                    onChange={(e) => {
                      if (e.target.checked) setRecursos([...recursos, r]);
                      else setRecursos(recursos.filter((res) => res !== r));
                    }}
                  />
                  <span className="w-5 h-5 rounded border border-input bg-background flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-colors">
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
