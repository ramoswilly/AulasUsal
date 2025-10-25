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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { BuildingTypes } from "@/lib/Tipos/tipos";
import { Pencil } from "lucide-react";

interface EditAulaProps {
  aulaId: string;
  currentNombre: string;
  currentTipo: string;
  currentCapacidad: number;
}

export function EditarAulaModal({
  aulaId,
  currentNombre,
  currentTipo,
  currentCapacidad,
}: EditAulaProps) {
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState(currentNombre);
  const [tipo, setTipo] = React.useState(currentTipo);
  const [capacidad, setCapacidad] = React.useState(currentCapacidad);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = { nombre_o_numero: nombre, tipo_aula: tipo, capacidad };
      const res = await fetch(`/api/aulas/${aulaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo actualizar el aula");
      }

      toast({
        title: "Aula actualizada",
        description: `El aula "${nombre}" se actualizó correctamente.`,
      });
      router.refresh();
      setOpen(false);
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
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Aula</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Tipo *</label>
              <Select onValueChange={setTipo} value={tipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  {BuildingTypes.map((bt) => (
                    <SelectItem key={bt} value={bt}>
                      {bt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Capacidad *</label>
              <Input
                type="number"
                value={capacidad}
                onChange={(e) => setCapacidad(parseInt(e.target.value))}
                required
              />
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
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
    </>
  );
}
