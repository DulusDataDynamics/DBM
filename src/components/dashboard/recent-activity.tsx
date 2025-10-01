import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { recentActivity } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function RecentActivity() {
    const userAvatar = PlaceHolderImages.find(p => p.id === '6');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>A log of your recent actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
                {recentActivity.map(activity => {
                    const avatar = PlaceHolderImages.find(p => p.id === activity.avatar);
                    return (
                        <div key={activity.id} className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                {avatar && <AvatarImage src={avatar.imageUrl} alt="Avatar" data-ai-hint={avatar.imageHint} />}
                                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                    <span className="font-semibold">{activity.user}</span> {activity.description}
                                </p>
                                <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
