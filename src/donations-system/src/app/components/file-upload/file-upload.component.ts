import { Component, ElementRef, HostListener, Input } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-file-upload",
	templateUrl: "./file-upload.component.html",
	styleUrls: ["./file-upload.component.scss"],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: FileUploadComponent,
		multi: true
	}]
})
export class FileUploadComponent {
	@Input()
	public invalid!: boolean;

	public onChange!: (file: File | null) => void;
	public file: File | null = null;

	public faTrashAlt = faTrashAlt;

	constructor (private readonly host: ElementRef<HTMLInputElement>) { }

	@HostListener("change", ["$event.target.files"])
	public emitFiles (event: FileList) {
		const file = event && event.item(0);
		this.onChange(file);
		this.file = file;

		$("#file").val("");
	}

	public writeValue () {
		this.host.nativeElement.value = "";
		this.file = null;
	}

	public registerOnChange (fn: (file: File | null) => void) {
		this.onChange = fn;
	}

	public registerOnTouched (fn: (file: File | null) => void) { }

	public onDrop (event: DragEvent) {
		event.preventDefault();

		const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.item(0);
		this.file = file;
		this.onChange(file);
	}

	public onDragOver (event: DragEvent) {
		event.stopPropagation();
		event.preventDefault();
	}

	public removeFile () {
		this.file = null;
		this.onChange(null);
	}
}

export function requiredFileType (types: string[], isRequired: boolean): (control: FormControl) => { required?: boolean, requiredFileType?: boolean } | null {
	types = types.map((t: string) => t.toLowerCase());

	return (control: FormControl) => {
		const file = control.value;
		if (!file) {
			if (!isRequired)
				return null;
			else
				return { required: true };
		}

		const extension = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();
		if (types.indexOf(extension) === -1 && types.indexOf("*") === -1)
			return { requiredFileType: true };

		return null;
	};
}
