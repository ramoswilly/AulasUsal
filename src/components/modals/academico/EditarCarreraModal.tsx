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

export function EditarCarreraModal({ carrera, sedes }) {
  console.log(carrera);

  const [open, setOpen] = React.useState(false);

  const [codigo, setCodigo] = React.useState(carrera.codigo_carrera);
  const [nombre, setNombre] = React.useState(carrera.nombre_carrera);
  const [anios, setAnios] = React.useState<number | "">(carrera.anios);
  const [sedeIds, setSedeIds] = React.useState<string[]>(
    carrera.sede_ids.map((s) => s.toString())
  );

  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo.trim() || !nombre.trim() || !anios || sedeIds.length === 0) {
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
        codigo_carrera: codigo,
        nombre_carrera: nombre,
        anios: Number(anios),
        sede_ids: sedeIds,
      };

      const res = await fetch(`/api/carreras/${carrera._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "No se pudo actualizar la carrera");
      }

      toast({
        title: "Carrera actualizada",
        description: `La carrera "${nombre}" ha sido modificada.`,
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
            <DialogTitle>Editar carrera</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Código *</label>
              <Input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Cantidad de años *</label>
              <Input
                type="number"
                value={anios}
                onChange={(e) => setAnios(e.target.valueAsNumber || "")}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Sedes *</label>
              <div className="flex flex-col flex-wrap gap-2 bg-sidebar p-2 rounded-md border border-input max-h-48 overflow-auto">
                {sedes.map((sede) => (
                  <label
                    key={sede._id}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      className="peer hidden"
                      value={sede._id.toString()}
                      checked={sedeIds.includes(sede._id.toString())}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSedeIds([...sedeIds, sede._id.toString()]);
                        else
                          setSedeIds(
                            sedeIds.filter((id) => id !== sede._id.toString())
                          );
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
                    <span>{sede.nombre}</span>
                  </label>
                ))}
              </div>
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
