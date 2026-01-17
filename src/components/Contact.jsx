import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to ship with us? Get in touch for a personalized quote or any inquiries about our services.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="bg-blue-100/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Our Office</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Eastgate Rd. Mombasa Road<br />
                Nairobi, Kenya<br />
                P.O. Box 12345-00100
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="bg-green-100/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Call Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                +254 746 888 942<br />
                +254 707 126 666<br />
                {/* 24/7 Customer Support */}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="bg-orange-100/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Email Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                support@highlandcargoafrica.com<br />
                {/* quotes@highlandcargo.com<br />
                support@highlandcargo.com */}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Request a Quote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" className="bg-background/50" />
                <Input placeholder="Last Name" className="bg-background/50" />
              </div>
              <Input placeholder="Email Address" className="bg-background/50" />
              <Input placeholder="Phone Number" className="bg-background/50" />
              <Input placeholder="Service Type" className="bg-background/50" />
              <Textarea placeholder="Describe your shipping requirements..." className="min-h-24 bg-background/50" />
              {/* <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                Request Quote
              </Button> */}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Ship with Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ready to start shipping? Create an account and get access to our online shipping platform.
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Create Account
                  </Button>
                  <Button variant="outline" className="w-full">
                    Track Existing Shipment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
