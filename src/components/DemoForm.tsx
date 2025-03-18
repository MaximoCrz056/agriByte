import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SNavbar from '@/components/SNavbar';
import Footer from '@/components/Footer';

export default function DemoForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company')
    };
    console.log('Preregistration data:', data);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SNavbar />
      <div className="flex-1 my-20">
        <div className="max-w-md mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold mb-6">Solicitar Demo</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input 
                id="name" 
                name="name" 
                required 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar solicitud
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}