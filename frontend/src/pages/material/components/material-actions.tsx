import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, View } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaterialActionsProps {
  material_id: number;
}

const MaterialActions = ({ material_id }: MaterialActionsProps) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="h-4 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black text-white">
        <DropdownMenuItem
          onClick={() => {
            navigate(`/material/${material_id}`);
          }}
        >
          <View className="h-4 w-4 mr-2" />
          view
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MaterialActions;
