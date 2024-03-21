import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventService } from '../services/event.service';
import { ElementRef } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import esLocale from '@fullcalendar/core/locales/es';
import { tap } from 'rxjs';
import { EventDialogEditComponent } from '../event-dialog-edit/event-dialog-edit/event-dialog-edit.component';
@Component({
  selector: 'app-fullcalendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './fullcalendar.component.html',
  styleUrl: './fullcalendar.component.css'
})
export class FullcalendarComponent implements AfterViewInit {

  public calendarOptions: any;
  public events: any[] = [];

  constructor(private eventService: EventService, private elRef: ElementRef, private dialog: MatDialog) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: this.events,
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      displayEventTime: false,
    };
  }

  ngAfterViewInit() {
    this.loadEvents();
    // Espera a que los eventos se carguen y el calendario se inicialice completamente
    setTimeout(() => {
      this.addDividerUnderTitle();
      this.customizeCalendarHeader();
      this.customizeCalendarTitle();
    }, 0);
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      console.log(events); //events.data añadir después s.s
      this.calendarOptions.events = events; //events.data añadir después s.s
    });
  }

  private addDividerUnderTitle() {

    const calendarContainer = this.elRef.nativeElement.querySelector('.fc-header-toolbar');
    if (calendarContainer) {
      const divider = document.createElement('div');
      divider.className = 'divider';
      divider.style.width = '100%';
      divider.style.marginBottom = '30px';
      divider.style.height = '1px';
      divider.style.backgroundImage = 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))';
      calendarContainer.after(divider);
    }
  }
  private customizeCalendarHeader() {
    setTimeout(() => {
      const headerElement = this.elRef.nativeElement.querySelector('.fc-header-toolbar');
      if (headerElement) {
        headerElement.style.display = 'flex';
        headerElement.style.justifyContent = 'space-between';
        headerElement.style.alignItems = 'center';
        headerElement.style.margin = '20px 40px';
        headerElement.style.height = '60px';
      }
    }, 0);
  }

  private customizeCalendarTitle() {
    setTimeout(() => {
      const titleElement = this.elRef.nativeElement.querySelector('.fc-toolbar-title');
      if (titleElement) {
        titleElement.style.margin = '0 0 16px';
      }
    }, 0);
  }


  handleDateClick(arg: any): void {
    const title = prompt('Título del Evento:');
    const description = prompt('Descripción del Evento:');
    const startDate = new Date(arg.dateStr).toISOString().split('T')[0]; // cambiamos para pasarlo a formato ISO8601 arg.dateStr;
    let endDate = prompt('Fecha de finalización del Evento (YYYY-MM-DD):', arg.dateStr);
    const capacity = parseInt(prompt('Capacidad del Evento (número entero):'));

    if (isNaN(capacity) || capacity <= 0) {
      alert("Capacidad no válida. Debe ser un número entero positivo.");
      return;
    }

    endDate = endDate ?? startDate;
    // Cambio de formato de endDate a ISO8601
    endDate = new Date(endDate).toISOString().split('T')[0];

    let startTime = prompt('Hora de inicio (HH:MM):', '00:00') ?? '00:00';
    let endTime = prompt('Hora de fin (HH:MM):', '23:59') ?? '23:59';

    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
      alert("Hora de inicio no válida. Formato correcto HH:MM.");
      return;
    }
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
      alert("Hora de fin no válida. Formato correcto HH:MM.");
      return;
    }

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    if (title) {
      const newEvent = {
        title,
        description: '',
        f_ini: startDateTime, //cambiado por f_ini en vez de start
        f_fin: endDateTime,    //cambiado por f_fin en vez de end
        capacity
      };

  //     this.eventService.createEvent(newEvent)
  // .pipe(
  //   tap(() => {
  //     this.loadEvents();
  //   })
  // )
  // .subscribe({
  //   next: () => {}, // Puedes manejar el resultado de la suscripción aquí si es necesario
  //   error: error => {
  //     console.error('Error al añadir el evento:', error);
  //     alert('Hubo un problema al añadir el evento.');
  //   }
  // });

    // }
  // }

    // ESTO ESTABA ANTERIORMENTE PERO LO CAMBIAMOS PQ AL PONER CREATEEVENT EL SUBSCRIBE SE TACHA DEPRECATED.
      this.eventService.createEvent(newEvent).subscribe(() => {
        this.loadEvents();
      }, error => {
        console.error('Error al añadir el evento:', error);
        alert('Hubo un problema al añadir el evento.');
      });

    }
  }


  handleEventClick(clickInfo: any): void {
    console.log("Datos del evento antes de abrir el diálogo:", clickInfo.event);

    const eventInfo = {
      id: clickInfo.event.id || clickInfo.event.extendedProps.publicId,
      title: clickInfo.event.title,
      start: clickInfo.event.start.toISOString(),
      end: clickInfo.event.end ? clickInfo.event.end.toISOString() : null
    };

    console.log("Información del evento estructurada:", eventInfo);

    const dialogRef = this.dialog.open(EventDialogEditComponent, {
      width: '250px',
      data: { event: eventInfo }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.event.delete) {
        const eventId = Number(result.event.id);
        console.log("Eliminando evento con ID:", eventId);
        this.eventService.deleteEvent(eventId).subscribe(() => {
          console.log("Evento eliminado exitosamente");
          this.loadEvents(); // Recarga los eventos
        }, error => console.error('Error al eliminar el evento:', error));
      } else if (result) {
        // Solo actualiza si el evento no está marcado para eliminación
        const eventId = Number(result.event.id);
        console.log("Actualizando evento con ID:", eventId, "y datos:", result.event);
        const { id, ...eventData } = result.event;
        this.eventService.updateEvent(eventId, eventData).subscribe(() => {
          console.log("Evento actualizado exitosamente");
          this.loadEvents(); // Recarga los eventos para reflejar los cambios
        }, error => console.error('Error al actualizar el evento:', error));
      }
    });
  }











  // constructor() { }

  // ngOninit() {

  //   this.calendarOptions = {
  //     plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  //     defaultDate: new Date(),
  //     locale: esLocale,
  //     header:{
  //       left: 'prev,next', //flechas
  //       center: 'title',
  //       right: 'dayGridMonth, timeGridWeek, timeGridDay'
  //     },
  //     editable: false //opcional quizá lo debamos cambiar a true

  //   }

  //   this.events = [
  //     {
  //       title: "Evento 1",
  //       description: "Clase de aperturas",
  //       startStr: new Date(),
  //       endStr: new Date("2024-03-20T12:30:45")
  //     },

  //     {
  //       title: "Evento 2",
  //       description: "Clase de finales",
  //       start: new Date(new Date().getTime() + 86400000),
  //       end: new Date(new Date().getTime() + (86400000 * 2))
  //     }
  //   ]
  // }
  // calendarOptions: CalendarOptions = {
  //   plugins: [dayGridPlugin],
  //   initialView: 'dayGridMonth',
  //   weekends: false,
  //   events: [
  //     { title: 'Meeting', start: new Date() }
  //   ]
  // };
}
