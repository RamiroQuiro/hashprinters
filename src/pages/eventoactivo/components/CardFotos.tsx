import type { Fotos } from "@/types"

interface PhotoCardProps {
  foto: Fotos
  onPrint: (foto: Fotos) => void
}

export default function CardFotos({ foto, onPrint }: PhotoCardProps) {
  /**
   * Handle print button click
   */
  const handlePrintClick = () => {
    if (!foto?.isPrinted && !foto?.isPrinting) {
      onPrint(foto)
    }
  }

  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
      foto?.isPrinting ? 'ring-2 ring-cyan-400 scale-105' : ''
    }`}>
      <div className="relative">
        <img 
          src={foto?.imageUrl} 
          alt={foto?.caption}
          className="w-full h-64 object-cover"
        />
        
        {/* Overlay for printed state */}
        {foto?.isPrinted && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Impresa
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-300 font-medium text-sm">@{foto?.username}</span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {foto?.caption}
        </p>
        
        <button
          onClick={handlePrintClick}
          disabled={foto?.isPrinted || foto?.isPrinting}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            foto?.isPrinted 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : foto?.isPrinting
              ? 'bg-cyan-600 text-white cursor-wait'
              : 'bg-cyan-500 hover:bg-cyan-400 text-white'
          }`}
        >
          {foto?.isPrinted 
            ? '✓ Impresa' 
            : foto?.isPrinting 
            ? 'Imprimiendo...' 
            : 'IMPRIMIR ESTA FOTO'}
        </button>
      </div>
    </div>
  )
}
