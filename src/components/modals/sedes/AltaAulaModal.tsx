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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { ClassroomTypes } from "@/lib/Tipos/tipos";

export function AltaAulaModal({ edificioId }: { edificioId: string }) {
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [capacidad, setCapacidad] = React.useState<number | "">("");
  const [tipo, setTipo] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !capacidad) {
      toast({
        title: "Error",
        description: "Los campos Nombre y Capacidad son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre_o_numero: nombre,
        capacidad: Number(capacidad),
        tipo_aula: tipo,
        edificio_id: edificioId,
      };

      const res = await fetch("/api/aulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo crear el aula");
      }

      toast({
        title: "Aula creada",
        description: `El aula "${nombre}" fue creada correctamente.`,
      });

      setNombre("");
      setCapacidad("");
      setTipo("");
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
        Nueva Aula
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nueva aula</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nombre o número *</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Capacidad *</label>
              <Input
                type="number"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.valueAsNumber || "")}
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
          </form>

          <DialogFooter>
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
