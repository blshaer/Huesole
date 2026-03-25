import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export default function SkeletonGradientCard() {
  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-0">
        <Skeleton className="h-48 w-full animate-shimmer" />
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4 p-4">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-6 w-32 animate-shimmer" />
          <Skeleton className="h-8 w-8 rounded-full animate-shimmer" />
        </div>

        <div className="flex w-full flex-wrap gap-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-6 rounded-full animate-shimmer" />
          ))}
        </div>

        <Skeleton className="h-8 w-full animate-shimmer" />

        <Tabs defaultValue="tailwind" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tailwind">
              <Skeleton className="h-4 w-16 animate-shimmer" />
            </TabsTrigger>
            <TabsTrigger value="css">
              <Skeleton className="h-4 w-8 animate-shimmer" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tailwind" className="mt-2">
            <Skeleton className="h-8 w-full animate-shimmer" />
          </TabsContent>
          <TabsContent value="css" className="mt-2">
            <Skeleton className="h-8 w-full animate-shimmer" />
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  );
}
