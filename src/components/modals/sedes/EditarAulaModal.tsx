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
import { Pencil } from "lucide-react";
import { AulaRecursos, ClassroomTypes } from "@/lib/Tipos/tipos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditAulaProps {
  aulaId: string;
  currentNombre: string;
  currentTipo: string;
  currentCapacidad: number;
  currentRecursos?: string[];
}

export function EditarAulaModal({
  aulaId,
  currentNombre,
  currentTipo,
  currentCapacidad,
  currentRecursos = [],
}: EditAulaProps) {
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState(currentNombre);
  const [tipo, setTipo] = React.useState(currentTipo);
  const [capacidad, setCapacidad] = React.useState(currentCapacidad);
  const [recursos, setRecursos] = React.useState<string[]>(currentRecursos);
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
      const payload = {
        nombre_o_numero: nombre,
        tipo_aula: tipo,
        capacidad,
        recursos,
      };
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
              <label className="text-sm font-medium">Tipo de aula</label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ClassroomTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
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

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Recursos</label>
              <div className="flex flex-col flex-wrap gap-2 bg-sidebar p-2 rounded-md border border-input">
                {AulaRecursos.map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      className="peer hidden"
                      value={r}
                      checked={recursos.includes(r)}
                      onChange={(e) => {
                        if (e.target.checked) setRecursos([...recursos, r]);
                        else setRecursos(recursos.filter((res) => res !== r));
                      }}
                    />
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
                    <span>{r}</span>
                  </label>
                ))}
              </div>
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
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
