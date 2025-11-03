import React from 'react'
import { Card, CardContent } from './Card';


type Props = {
    infoValor: string;
    infoTitulo: string;
    infoDescripcion: string;
    icono: React.ReactNode;
    color: string;
}

export default function Stats({infoValor, infoTitulo, infoDescripcion, icono,color="text-primary-100"}: Props) {
    const Icono = icono;
  return (
    <Card className="border-primary-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-texto">{infoTitulo}</p>
                <h3 className="text-2xl font-bold text-primary-textTitle mt-2">
                  {infoValor}
                </h3>
                <p className="text-xs text-primary-texto mt-1">
                  {infoDescripcion}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Icono className={`h-6 w-6 ${color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
  )
}