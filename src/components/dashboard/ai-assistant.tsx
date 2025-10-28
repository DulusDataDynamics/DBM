'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function AiAssistant() {
  const [summary, setSummary] = useState<string | null>("Daily summary is currently unavailable while we upgrade our systems.");
  const [insights, setInsights] = useState<string | null>("Smart suggestions are currently unavailable.");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">AI Assistant</CardTitle>
            <CardDescription>Your AI-powered business insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {isLoading ? <p>Analyzing your data...</p> : (
              <>
                {summary && (
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Daily Summary</h4>
                            <p className="text-sm text-muted-foreground">{summary}</p>
                        </div>
                    </div>
                )}
                {insights && (
                     <div className="flex items-start gap-4">
                         <div className="bg-accent/10 text-accent p-2 rounded-full">
                            <Lightbulb className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Smart Suggestions</h4>
                            <p className="text-sm text-muted-foreground">{insights}</p>
                        </div>
                    </div>
                )}
              </>
            )}
        </CardContent>
    </Card>
  )
}
