/* eslint-disable solid/reactivity */
import { createEffect, createSignal, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { CloudArrowUpIcon, CheckIcon } from '~/components/icons/heroicons/24/outline';
import 'croppie/croppie.css';
import Croppie from 'croppie';
import { Button } from '../button';

interface ImageState {
  error: string | null;
  loading: boolean;
  file: File;
  croppedImage: string | null;
}

interface ImageDropProps {
  onCropComplete: (state: ImageState) => void;
  aspectRatioWidth?: number;
  aspectRatioHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  onImageLoaded?: () => void;
  onImageCleared?: () => void;
}

interface CroppieOptions {
  viewport: {
    width: number;
    height: number;
    type: 'square' | 'circle';
  };
  boundary: {
    width: number;
    height: number;
  };
  enableOrientation: boolean;
  enableZoom: boolean;
  mouseWheelZoom: boolean;
  showZoomer: boolean;
}

function useCroppie(elementId: string, options: CroppieOptions) {
  const [instance, setInstance] = createSignal<Croppie | null>(null);

  const initCroppie = async (imageUrl: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      const croppie = new Croppie(el, options);
      await croppie.bind({ url: imageUrl });
      setInstance(croppie);
      return croppie;
    }
    return null;
  };

  const destroy = () => {
    instance()?.destroy();
    setInstance(null);
  };

  return {
    instance,
    initCroppie,
    destroy
  };
}

export default function ImageDrop(props: ImageDropProps) {
  const [state, setState] = createStore<ImageState>({
    error: null,
    loading: false,
    file: {} as File,
    croppedImage: null
  });

  const [dropZoneActive, setDropZoneActive] = createSignal(false);
  const [uploading, setUploading] = createSignal(false);
  const [preview, setPreview] = createSignal<string | null>(null);

  const croppieOptions: CroppieOptions = {
    viewport: {
      width: props.viewportWidth ?? 200,
      height: props.viewportHeight ?? 200,
      type: props.aspectRatioWidth === props.aspectRatioHeight ? 'circle' : 'square'
    },
    boundary: {
      width: (props.viewportWidth ?? 200) + 100,
      height: (props.viewportHeight ?? 200) + 100
    },
    enableOrientation: true,
    enableZoom: true,
    mouseWheelZoom: true,
    showZoomer: true
  };

  const { instance: croppieInstance, initCroppie, destroy: destroyCroppie } = useCroppie('croppie-container', croppieOptions);

  const noPropagate = (e: Event) => {
    e.preventDefault();
  };

  const handleError = (error: unknown) => {
    console.error('Operation failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    setState('error', message);
  };

  const uploadFile = (file: File) => {
    setUploading(true);
    setState('loading', true);
    setState('file', file);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      handleError(e);
    } finally {
      setState('loading', false);
      setUploading(false);
    }
  };

  const handleFileDrop = (e: DragEvent) => {
    e.preventDefault();
    setDropZoneActive(false);
    const files = e.dataTransfer?.files;
    if (files?.[0]) {
      uploadFile(files[0]);
    }
  };

  const handleFileInput = (e: Event) => {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files;
    if (files?.[0]) {
      uploadFile(files[0]);
    }
  };

  const handleSave = async () => {
    const instance = croppieInstance();
    if (!instance) return;

    try {
      const result = await instance.result({
        type: 'base64',
        size: 'viewport',
        format: 'png',
        quality: 1
      });
      setState('croppedImage', result as string);
      props.onCropComplete(state);
    } catch (e) {
      handleError(e);
    }
  };

  createEffect(() => {
    const previewUrl = preview();
    if (previewUrl) {
      void initCroppie(previewUrl)
        .then(() => {
          props.onImageLoaded?.();
        })
        .catch(handleError);
    } else {
      props.onImageCleared?.();
    }
    return () => {
      destroyCroppie();
    };
  });

  return (
    <>
      <Show when={state.error}>
        <div class="text-red-500 mb-4">{state.error}</div>
      </Show>
      <Show when={preview() !== null}>
        <div>
          <div class="pt-6">
            <div id="croppie-container"></div>
          </div>
          <Button
              class="w-full flex justify-center items-center px-4 gap-2"
              variant='Primary'
              color='Reimu'
              onClick={() => handleSave()}
              disabled={state.loading}
          >
              <CheckIcon class="-ml-0.5 h-5 w-5 text-white" />
              Save
          </Button>
        </div>
      </Show>
      <Show when={preview() === null}>
        <form class="min-h-96 min-w-96" aria-labelledby="dropzone-label">
          <button
            id="dropzone"
            type="button"
            aria-label="Click or drag and drop to upload image"
            class={`${dropZoneActive() ? 'bg-green-100' : ''} ${
              uploading() && 'opacity-50'
            } place-content-center place-items-center h-96 w-96 border-2 border-gray-300 border-dashed rounded-md sm:flex p-2 m-2`}
            onDragEnter={() => uploading() ? undefined : setDropZoneActive(true)}
            onDragLeave={() => setDropZoneActive(false)}
            onDragOver={noPropagate}
            onDrop={(event) => uploading() ? noPropagate(event) : handleFileDrop(event)}
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={uploading()}
          >
            <div>
              <CloudArrowUpIcon class="h-48 w-48 text-gray-300" />
              <div class="mt-4 flex flex-col text-sm justify-center leading-6 text-gray-600">
                <Button 
                  variant='Primary' 
                  color='Reimu' 
                  disabled={uploading()}
                >
                  Upload Image
                </Button>
                <p class="text-xs leading-5 text-gray-600 mt-2 text-center">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            <input
              id="image-upload"
              name="file"
              type="file"
              accept="image/*"
              disabled={uploading()}
              multiple={false}
              onInput={handleFileInput}
              class="sr-only"
            />
          </button>
        </form>
      </Show>
    </>
  );
} 