import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';
import { supabase } from 'src/app/supabase.client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonInput
  ]
})
export class HomePage implements OnInit {
  email = '';
  newMessage = '';
  messages: any[] = [];

  @ViewChild(IonInput) messageInput!: IonInput;

  constructor(private router: Router) {}

  async ngOnInit() {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      this.router.navigate(['/auth']);
    } else {
      this.email = userData.user.email || '';
      await this.fetchMessages();
    }
  }

  async fetchMessages() {
    const { data, error } = await supabase
      .from('public.messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) {
      this.messages = data || [];
    } else {
      console.error('Error al obtener mensajes:', error.message);
    }
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') return;
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          content: this.newMessage,
          user_email: this.email
        }
      ])
      .select();

    if (error) {
      console.error('Error al enviar mensaje:', error.message);
      return;
    }

    if (data) {
      this.messages.push(...data);
      this.newMessage = '';
      setTimeout(() => this.messageInput.setFocus(), 100);
      console.log('Mensaje enviado:', data);
    }
  }

  async logout() {
    await supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy() {}
}
