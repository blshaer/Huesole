import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientCard from "@/features/gradients/components/GradientCard";
import { useFavorites } from "@/features/gradients/hooks/useFavorites";
import { Button } from "@/shared/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface Gradient {
  id: string;
  name: string;
  colors: string[];
}

const MyGradientsPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [gradientToDelete, setGradientToDelete] = useState<Gradient | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const setBackground = (background: string) => {
    console.log("Setting background:", background);
  };

  const handleEditGradient = (gradient: { name: string; colors: string[] }) => {
    const css = `linear-gradient(90deg, ${gradient.colors.join(", ")})`;
    setBackground(css);

    navigate("/ai-generator", {
      state: {
        name: gradient.name,
        colors: gradient.colors,
      },
    });
  };

  const VITE_API_URL = import.meta.env.VITE_API_URL || "";
  const API_URL = `${VITE_API_URL}/api/ai`;

  const handleDeleteClick = (gradient: Gradient) => {
    if (!gradient.id) {
      console.error("Missing gradient ID:", gradient);
      toast({
        title: "Error",
        description: "Cannot delete this gradient: Missing unique ID.",
        variant: "destructive"
      });
      return;
    }
    setGradientToDelete(gradient);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!gradientToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${gradientToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGradients((prev) => prev.filter((g) => g.id !== gradientToDelete.id));
      setShowDeleteDialog(false);
      toast({
        title: "Success",
        description: `"${gradientToDelete.name}" has been deleted.`,
      });
    } catch (error: any) {
      console.error("Failed to delete gradient", error);
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "An error occurred while deleting.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setGradientToDelete(null);
    }
  };

  useEffect(() => {
    const fetchGradients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ data: Gradient[] }>(
          `${API_URL}/my-gradients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Ensure every item has an ID
        const dataWithIds = response.data.data.map((g: any) => ({
          ...g,
          id: g.id || g._id
        }));
        setGradients(dataWithIds);
      } catch (error) {
        console.error("Failed to fetch custom gradients", error);
        toast({
          title: "Error",
          description: "Failed to load your gradients.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGradients();
  }, []);

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-[var(--background)]"
      >
        <div className="text-base text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Loading your creative gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen bg-[var(--background)] py-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <AnimatePresence mode="popLayout">
          {gradients.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {gradients.map((gradient) => (
                  <motion.div
                    key={gradient.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <GradientCard
                      gradient={gradient}
                      isFavorite={favorites.includes(gradient.name)}
                      onFavoriteToggle={toggleFavorite}
                      onEditClick={handleEditGradient}
                      onDeleteClick={handleDeleteClick as any}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] py-20 text-center"
            >
              <Sparkles className="text-white" size={64} />
              <h2 className="text-xl text-white font-semibold">No custom gradients yet</h2>
              <p className="max-w-sm text-white/50">
                Use the AI Generator in the dropdown to create unique color
                schemes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-black/90 backdrop-blur-3xl border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-3">

              Delete Gradient
            </DialogTitle>
            <DialogDescription className="text-white/60 pt-2 text-base">
              Are you sure you want to delete <span className="font-bold text-white">"{gradientToDelete?.name}"</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Gradient"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyGradientsPage;
