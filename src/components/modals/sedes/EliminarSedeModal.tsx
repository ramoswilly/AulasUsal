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

interface DeleteSedeProps {
  sedeId: string;
  sedeNombre: string;
}

export function EliminarSedeModal({ sedeId, sedeNombre }: DeleteSedeProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sedes/${sedeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo eliminar la sede");
      }

      toast({
        title: "Sede eliminada",
        description: `La sede "${sedeNombre}" y todos sus edificios y aulas fueron eliminados.`,
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
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        className="w-8 h-8"
      >
        <Trash2 />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar sede</DialogTitle>
          </DialogHeader>

          <p className="py-4 text-sm text-muted-foreground">
            ¿Está seguro que desea eliminar la sede "{sedeNombre}"? Esta acción
            no se puede deshacer. <br />
            Todos los edificios y aulas asociados serán eliminados.
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
