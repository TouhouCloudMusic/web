import type Croppie from "croppie"
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
} from "solid-js"
import { createStore } from "solid-js/store"
import {
  CloudArrowUpIcon,
  CheckIcon,
} from "~/components/icons/heroicons/24/outline"
import { createCroppie } from "~/lib/adapter/croppie"
import { deepMerge } from "~/lib/object"
import { type NestedPartial } from "~/types"
import { createAtom } from "~/utils/createAtom"

import { Button } from "../button"

import "croppie/croppie.css"

type ImageState = {
  error: string | null
  loading: boolean
  file: File
  croppedImage: string | null
}

type ImageDropProps<DeepMerge extends boolean> = {
  onCropComplete: (state: ImageState) => void
  onImageLoaded?: () => void
  onImageCleared?: () => void

  option?: DeepMerge extends true ? NestedPartial<Croppie.CroppieOptions>
  : Partial<Croppie.CroppieOptions>
  /** @default true */
  deepMergeOption?: DeepMerge | undefined
}

const DEFAULT_OPTION: Croppie.CroppieOptions = {
  viewport: {
    width: 200,
    height: 200,
    type: "square",
  },
  boundary: {
    width: 200 + 100,
    height: 200 + 100,
  },
  enableOrientation: true,
  enableZoom: true,
  mouseWheelZoom: true,
  showZoomer: true,
}

export default function ImageDrop<T extends boolean = true>(
  props: ImageDropProps<T>,
) {
  const ref = createAtom<HTMLElement>()

  const [dropZoneActive, setDropZoneActive] = createSignal(false)
  const [uploading, setUploading] = createSignal(false)
  const [preview, setPreview] = createSignal<string | null>(null)

  const [state, setState] = createStore<ImageState>({
    error: null,
    loading: false,
    file: {} as File,
    croppedImage: null,
  })

  const croppieOptions = createMemo<Croppie.CroppieOptions>(() => {
    if (!props.option) {
      return DEFAULT_OPTION
    }

    if (props.deepMergeOption ?? true) {
      return deepMerge(
        DEFAULT_OPTION as Croppie.CroppieOptions & Record<string, unknown>,
        props.option,
      )
    } else {
      return Object.assign({}, DEFAULT_OPTION, props.option)
    }
  })

  const croppie = createCroppie(ref, croppieOptions)

  const noPropagate = (e: Event) => {
    e.preventDefault()
  }

  const handleError = (error: unknown) => {
    console.error("Operation failed:", error)
    const message = error instanceof Error ? error.message : String(error)
    setState("error", message)
  }

  const uploadFile = (file: File) => {
    setUploading(true)
    setState("loading", true)
    setState("file", file)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } catch (e) {
      handleError(e)
    } finally {
      setState("loading", false)
      setUploading(false)
    }
  }

  const handleFileDrop = (e: DragEvent) => {
    e.preventDefault()
    setDropZoneActive(false)
    const files = e.dataTransfer?.files
    if (files?.[0]) {
      uploadFile(files[0])
    }
  }

  const handleFileInput = (e: Event) => {
    e.preventDefault()
    const files = (e.target as HTMLInputElement).files
    if (files?.[0]) {
      uploadFile(files[0])
    }
  }

  const handleSave = async () => {
    if (!croppie()) return

    try {
      const result = await croppie()!.result({
        type: "base64",
        size: "viewport",
        format: "png",
        quality: 1,
      })
      setState("croppedImage", result)
      props.onCropComplete(state)
    } catch (e) {
      handleError(e)
    }
  }

  createEffect(() => {
    if (preview()) {
      let onLoad = props.onImageLoaded
      void croppie()
        ?.bind({ url: preview()! })
        .then(() => {
          onLoad?.()
        })
        .catch(handleError)
    } else {
      props.onImageCleared?.()
    }
  })

  return (
    <>
      <Show when={state.error}>
        <div class="mb-4 text-reimu-500">{state.error}</div>
      </Show>
      <Show when={preview() !== null}>
        <div>
          <div class="pt-6">
            <div ref={ref}></div>
          </div>
          <Button
            class="flex w-full items-center justify-center gap-2 px-4"
            variant="Primary"
            color="Reimu"
            onClick={() => handleSave()}
            disabled={state.loading}
          >
            <CheckIcon class="-ml-0.5 h-5 w-5 text-white" />
            Save
          </Button>
        </div>
      </Show>
      <Show when={preview() === null}>
        <form
          class="min-h-96 min-w-96"
          aria-labelledby="dropzone-label"
        >
          <button
            id="dropzone"
            type="button"
            aria-label="Click or drag and drop to upload image"
            class={`${dropZoneActive() ? "bg-green-100" : ""} ${
              uploading() && "opacity-50"
            } m-2 h-96 w-96 place-content-center place-items-center rounded-md border-2 border-dashed border-gray-300 p-2 sm:flex`}
            onDragEnter={() =>
              uploading() ? undefined : setDropZoneActive(true)
            }
            onDragLeave={() => setDropZoneActive(false)}
            onDragOver={noPropagate}
            onDrop={(event) =>
              uploading() ? noPropagate(event) : handleFileDrop(event)
            }
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={uploading()}
          >
            <div>
              <CloudArrowUpIcon class="h-48 w-48 text-gray-300" />
              <div class="mt-4 flex flex-col justify-center text-sm leading-6 text-gray-600">
                <Button
                  variant="Primary"
                  color="Reimu"
                  disabled={uploading()}
                >
                  Upload Image
                </Button>
                <p class="mt-2 text-center text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
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
  )
}
