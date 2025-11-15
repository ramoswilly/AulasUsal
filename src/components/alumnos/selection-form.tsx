'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Assuming the props will be serialized, so we don't need the full Mongoose models
interface Sede {
  _id: string;
  nombre: string;
}

interface Career {
  _id: string;
  nombre_carrera: string;
  sede_ids: string[];
}

interface SelectionFormProps {
  sedes: Sede[];
  allCareers: Career[];
}

export function SelectionForm({ sedes, allCareers }: SelectionFormProps) {
  const [selectedSede, setSelectedSede] = useState<string>('');
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredCareers = useMemo(() => {
    if (!selectedSede) return [];
    return allCareers.filter((career) => 
      career.sede_ids.includes(selectedSede)
    );
  }, [selectedSede, allCareers]);

  const handleSedeChange = (value: string) => {
    setSelectedSede(value);
    setSelectedCareer('');
  };

  const handleViewSchedule = () => {
    if (selectedCareer) {
      startTransition(() => {
        router.push(`/horarios-alumnos/${selectedCareer}`);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="sede-select" className="text-md font-semibold">1. Sede</Label>
        <Select value={selectedSede} onValueChange={handleSedeChange}>
          <SelectTrigger id="sede-select" className="w-full text-base h-12">
            <SelectValue placeholder="Selecciona tu sede" />
          </SelectTrigger>
          <SelectContent>
            {sedes.map((sede) => (
              <SelectItem key={sede._id} value={sede._id} className="text-base">
                {sede.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn("w-full space-y-2 transition-opacity duration-300", !selectedSede && 'opacity-50 pointer-events-none')}>
        <Label htmlFor="career-select" className="text-md font-semibold">2. Carrera</Label>
        <Select value={selectedCareer} onValueChange={setSelectedCareer} disabled={!selectedSede}>
          <SelectTrigger id="career-select" className="w-full text-base h-12">
            <SelectValue placeholder="Selecciona tu carrera" />
          </SelectTrigger>
          <SelectContent>
            {filteredCareers.map((career) => (
              <SelectItem key={career._id} value={career._id} className="text-base">
                {career.nombre_carrera}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleViewSchedule}
        disabled={!selectedCareer || isPending}
        className="w-full text-lg h-12 mt-4"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Cargando...
          </>
        ) : (
          <>
            Ver Horarios
            <ChevronRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </div>
  );
}
