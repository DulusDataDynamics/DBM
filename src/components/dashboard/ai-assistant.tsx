import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeDailyActivity } from '@/ai/flows/summarize-daily-activity';
import { generateBusinessInsights } from '@/ai/flows/generate-business-insights';
import { dailyActivityData, financialData, salesData } from '@/lib/data';
import { Lightbulb, Sparkles } from 'lucide-react';

async function AiSummary() {
    const summaryResult = await summarizeDailyActivity(dailyActivityData);
    return (
        <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-2 rounded-full">
                <Sparkles className="h-5 w-5" />
            </div>
            <div>
                <h4 className="font-semibold">Daily Summary</h4>
                <p className="text-sm text-muted-foreground">{summaryResult.summary}</p>
            </div>
        </div>
    );
}

async function AiInsights() {
    const insightsResult = await generateBusinessInsights({
        salesData: JSON.stringify(salesData),
        financialData: JSON.stringify(financialData),
    });
    return (
         <div className="flex items-start gap-4">
             <div className="bg-accent/10 text-accent p-2 rounded-full">
                <Lightbulb className="h-5 w-5" />
            </div>
            <div>
                <h4 className="font-semibold">Smart Suggestions</h4>
                <p className="text-sm text-muted-foreground">{insightsResult.insights}</p>
            </div>
        </div>
    );
}

export function AiAssistant() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">AI Assistant</CardTitle>
            <CardDescription>Your AI-powered business insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <AiSummary />
            <AiInsights />
        </CardContent>
    </Card>
  )
}
