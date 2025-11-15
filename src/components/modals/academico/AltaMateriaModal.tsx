"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

export function AltaMateriaModal({ carreras }) {
  const [open, setOpen] = React.useState(false);
  const [codigo, setCodigo] = React.useState("");
  const [nombre, setNombre] = React.useState("");

  const [carreraId, setCarreraId] = React.useState("");
  const [anioCarrera, setAnioCarrera] = React.useState<number | "">("");
  const [cuatrimestre, setCuatrimestre] = React.useState<number | "">("");

  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !codigo.trim() ||
      !nombre.trim() ||
      !carreraId ||
      !anioCarrera ||
      !cuatrimestre
    ) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        codigo_materia: codigo,
        nombre_materia: nombre,
        carrera_id: carreraId,
        anio_carrera: Number(anioCarrera),
        cuatrimestre: Number(cuatrimestre),
      };

      const res = await fetch("/api/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo crear la materia");
      }

      toast({
        title: "Materia creada",
        description: `La materia "${nombre}" fue creada correctamente.`,
      });

      setCodigo("");
      setNombre("");
      setCarreraId("");
      setAnioCarrera("");
      setCuatrimestre("");

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
      <Button onClick={() => setOpen(true)}>
        <PlusCircle />
        Nueva Materia
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nueva materia</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
            {/* Código */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Código *</label>
              <Input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>

            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            {/* Carrera */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Carrera *</label>
              <select
                className="border rounded-md p-2"
                value={carreraId}
                onChange={(e) => setCarreraId(e.target.value)}
                required
              >
                <option value="">Seleccionar carrera...</option>
                {carreras.map((carr) => (
                  <option key={carr._id} value={carr._id}>
                    {carr.nombre_carrera}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Cuatrimestre *</label>
              <select
                className="border rounded-md p-2"
                value={cuatrimestre}
                onChange={(e) => setCuatrimestre(Number(e.target.value))}
                required
              >
                <option value="">Seleccionar...</option>
                <option value={1}>1° Cuatrimestre</option>
                <option value={2}>2° Cuatrimestre</option>
                <option value={3}>Anual</option>
              </select>
            </div>
          </form>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Creando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
