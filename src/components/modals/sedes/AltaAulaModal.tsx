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
import { AulaRecursos, ClassroomTypes } from "@/lib/Tipos/tipos";

export function AltaAulaModal({ edificioId }: { edificioId: string }) {
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [capacidad, setCapacidad] = React.useState<number | "">("");
  const [tipo, setTipo] = React.useState("");
  const [recursos, setRecursos] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !capacidad || !tipo) {
      toast({
        title: "Error",
        description: "Los campos Nombre, Capacidad y Tipo son obligatorios.",
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
        recursos,
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
      setRecursos([]);
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
