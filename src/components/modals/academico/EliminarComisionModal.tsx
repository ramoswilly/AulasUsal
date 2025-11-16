"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function EliminarComisionModal({ comision }) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/comisiones/${comision._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar");

      toast({ title: "Comisión eliminada" });
      router.refresh();
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 />
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar comisión</DialogTitle>
        </DialogHeader>

        <p className="py-4 text-sm text-muted-foreground">
          ¿Estás seguro de que deseas eliminar la comisión "
          {comision.nombre_comision}"? Esta acción no se puede deshacer.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          <Button
            disabled={loading}
            variant="destructive"
            onClick={handleDelete}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
