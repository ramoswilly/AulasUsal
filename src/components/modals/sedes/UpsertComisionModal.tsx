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
import { upsertComision } from "@/lib/actions";
import type { IComision } from "@/models/Comision";
import { Combobox } from "@/components/ui/combobox";

interface UpsertComisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  comision: IComision | null;
  context: {
    day: string;
    semester: number;
    year: number;
    turn: string;
    selectedProgram: string;
  };
  courses: any[];
}

export function UpsertComisionModal({
  isOpen,
  onClose,
  comision,
  context,
  courses,
}: UpsertComisionModalProps) {
  const [nombre_comision, setNombreComision] = React.useState(
    comision?.nombre_comision || ""
  );
  const [profesor, setProfesor] = React.useState(comision?.profesor || "");
  const [inscriptos, setInscriptos] = React.useState(
    comision?.inscriptos || 0
  );
  const [materia_id, setMateriaId] = React.useState(
    comision?.materia_ids[0] || ""
  );
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const filteredCourses = courses.filter(
    (c) => c.carrera_id?._id === context.selectedProgram
  );

  const courseOptions = filteredCourses.map((c) => ({
    value: c._id,
    label: c.nombre_materia,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre_comision.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la comisión es obligatorio",
        variant: "destructive",
      });
      return;
    }
    if (!materia_id) {
      toast({
        title: "Error",
        description: "Debe seleccionar una materia",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await upsertComision({
        _id: comision?._id,
        nombre_comision,
        profesor,
        inscriptos,
        horario: {
          dia: context.day,
          turno: context.turn,
        },
        materia_ids: [materia_id],
        anio_dictado: new Date().getFullYear(),
      });

      toast({
        title: comision ? "Comisión actualizada" : "Comisión creada",
        description: `La comisión se ha guardado correctamente.`,
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {comision ? "Editar comisión" : "Crear nueva comisión"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Materia *</label>
            <Combobox
              options={courseOptions}
              value={materia_id}
              onChange={setMateriaId}
              placeholder="Seleccionar materia..."
              searchPlaceholder="Buscar materia..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre de comisión *</label>
            <Input
              value={nombre_comision}
              onChange={(e) => setNombreComision(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Profesor</label>
            <Input
              value={profesor}
              onChange={(e) => setProfesor(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Inscriptos</label>
            <Input
              type="number"
              value={inscriptos}
              onChange={(e) => setInscriptos(Number(e.target.value))}
            />
          </div>
        </form>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
