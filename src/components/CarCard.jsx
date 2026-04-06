import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { useState } from "react";

const CarCard = ({ id, name, image, price, year, mileage, modifications, onViewDetails }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-[var(--shadow-card)] transition-all duration-300"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
        transition: 'transform 0.3s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 right-3">
          ₹{price.toLocaleString()}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-sm text-muted-foreground">{year}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">{mileage}</p>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Modifications:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {modifications.map((mod, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {mod}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => onViewDetails(id)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;