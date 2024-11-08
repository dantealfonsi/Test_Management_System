import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatIconModule } from '@angular/material/icon';
import { UserNavbarComponent } from '../../assets/user-navbar/user-navbar.component';
import { FooterComponent } from '../../assets/footer/footer.component';
import { Router } from "@angular/router";

@Component({
  selector: 'app-view-lessons',
  standalone: true,
  imports: [CommonModule,YouTubePlayerModule,MatIconModule,UserNavbarComponent, FooterComponent,],
  templateUrl: './view-lessons.component.html',
  styleUrl: './view-lessons.component.css'
})

export class ViewLessonsComponent implements OnInit {

  lesson: any;
  itemId: any;
  lesson_order: any;
  url!: string;
  videoUrl: string = 'http://localhost/iso2sys_rest_api/videos/prueba.mp4';


  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public router: Router
  ) {}

  unitsAndLessons!: any[];

  async unitsAndLessonsListRecover(){
    try {
      const response = await fetch(
        "http://localhost/iso2sys_rest_api/server.php?units_and_lessons_list="  
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }


async this_specific_lesson_recover() {
    function extractVideoId(url: string) {
        let videoId;

        if (url.includes('youtu.be')) {
            // Shortened URL
            videoId = url.split('youtu.be/')[1];
        } else if (url.includes('youtube.com')) {
            // Standard URL
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
        }

        return videoId;
    }

    try {
        const response = await fetch(
            `http://localhost/iso2sys_rest_api/server.php?this_specific_lesson_list=&id=${this.itemId}&lesson_order=${this.lesson_order}`
        );
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        const data = await response.json();
        console.log('Datos recibidos:', data);

        // Assuming data.url contains the video URL
        if (data.url) {
            const videoId = extractVideoId(data.url);
            console.log('Extracted Video ID:', videoId);
            data.url = videoId; // Add the videoId to the data object
        }

        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

filterUnitsAndLessons(unitsAndLessons: any[], itemId: any) { return unitsAndLessons.filter(unit => unit.id === itemId);}
  
  async ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.lesson_order = this.route.snapshot.paramMap.get('lesson_order');
    this.lesson = await this.this_specific_lesson_recover();

    this.unitsAndLessonsListRecover().then(data => { 
      this.unitsAndLessons = this.filterUnitsAndLessons(data, this.itemId); 
      console.log("Unidades y lecciones filtradas:", this.unitsAndLessons); 
    }).catch(error => { console.error('Error recuperando las unidades y lecciones:', error); 

    });

    this.url = this.lesson.url;
  }

  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  }  

  capitalizeWords(str : string) : string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  goToLesson(unitId: string, lessonOrder: string): void {
    this.router.navigate(['/view-lessons', unitId, lessonOrder]);
    location.reload();
  }


}  