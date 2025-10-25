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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteBuildingProps {
  buildingId: string;
  buildingNombre: string;
}

export function EliminarEdificioModal({
  buildingId,
  buildingNombre,
}: DeleteBuildingProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/edificios/${buildingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo eliminar el edificio");
      }

      toast({
        title: "Edificio eliminado",
        description: `El edificio "${buildingNombre}" y todas sus aulas fueron eliminados.`,
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
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar edificio</DialogTitle>
          </DialogHeader>

          <p className="py-4 text-sm text-muted-foreground">
            ¿Está seguro que desea eliminar el edificio "{buildingNombre}"? Esta
            acción no se puede deshacer. <br />
            Todas las aulas asociadas serán eliminadas.
          </p>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
