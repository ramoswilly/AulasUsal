"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export function EditarMateriaModal({ materia, carreras }) {
  const [open, setOpen] = React.useState(false);

  const [codigo, setCodigo] = React.useState(materia.codigo_materia);
  const [nombre, setNombre] = React.useState(materia.nombre_materia);
  const [carreraId, setCarreraId] = React.useState(
    materia.carrera_id?._id || ""
  );
  const [anioCarrera, setAnioCarrera] = React.useState(materia.anio_carrera);
  const [cuatrimestre, setCuatrimestre] = React.useState(materia.cuatrimestre);

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        codigo_materia: codigo,
        nombre_materia: nombre,
        carrera_id: carreraId,
        anio_carrera: Number(anioCarrera),
        cuatrimestre: Number(cuatrimestre),
      };

      const res = await fetch(`/api/materias/${materia._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "No se pudo actualizar la materia");
      }

      toast({
        title: "Materia actualizada",
        description: `La materia ${nombre} fue modificada correctamente.`,
      });

      router.refresh();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar materia</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
            {/* Código */}
            <div>
              <label className="text-sm font-medium">Código *</label>
              <Input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            {/* Carrera */}
            <div>
              <label className="text-sm font-medium">Carrera *</label>
              <select
                className="border rounded-md p-2 w-full"
                value={carreraId}
                onChange={(e) => setCarreraId(e.target.value)}
              >
                {carreras.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre_carrera}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label className="text-sm font-medium">Año de la carrera *</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={anioCarrera}
                onChange={(e) => setAnioCarrera(e.target.valueAsNumber || "")}
                required
              />
            </div>

            {/* Cuatrimestre */}
            <div>
              <label className="text-sm font-medium">Cuatrimestre *</label>
              <select
                className="border rounded-md p-2 w-full"
                value={cuatrimestre}
                onChange={(e) => setCuatrimestre(Number(e.target.value))}
              >
                <option value={1}>1° Cuatrimestre</option>
                <option value={2}>2° Cuatrimestre</option>
                <option value={3}>Anual</option>
              </select>
            </div>
          </form>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
