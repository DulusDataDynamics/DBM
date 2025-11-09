import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SupportPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support</CardTitle>
        <CardDescription>
          Get help and support for using the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>For support, please contact us at support@dulus.com.</p>
      </CardContent>
    </Card>
  );
}
