// components/ui/use-toast.js
"use client"

import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

export const ToastActionType = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map()

export const ToastContext = React.createContext()

export function ToastContextProvider({
  children,
}) {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case ToastActionType.ADD_TOAST:
          return {
            ...state,
            toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
          }

        case ToastActionType.UPDATE_TOAST:
          return {
            ...state,
            toasts: state.toasts.map((t) =>
              t.id === action.toast.id ? { ...t, ...action.toast } : t
            ),
          }

        case ToastActionType.DISMISS_TOAST: {
          const { id } = action

          if (id) {
            if (toastTimeouts.has(id)) {
              clearTimeout(toastTimeouts.get(id))
              toastTimeouts.delete(id)
            }

            return {
              ...state,
              toasts: state.toasts.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      open: false,
                    }
                  : t
              ),
            }
          }

          return {
            ...state,
            toasts: state.toasts.map((t) => ({
              ...t,
              open: false,
            })),
          }
        }
        case ToastActionType.REMOVE_TOAST:
          if (action.id === undefined) {
            return {
              ...state,
              toasts: [],
            }
          }
          return {
            ...state,
            toasts: state.toasts.filter((t) => t.id !== action.id),
          }

        default:
          return state
      }
    },
    {
      toasts: [],
    }
  )

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open && !toastTimeouts.has(toast.id)) {
        const timeout = setTimeout(() => {
          dispatch({
            type: ToastActionType.DISMISS_TOAST,
            id: toast.id,
          })

          setTimeout(() => {
            dispatch({
              type: ToastActionType.REMOVE_TOAST,
              id: toast.id,
            })
          }, 300)
        }, toast.duration || TOAST_REMOVE_DELAY)

        toastTimeouts.set(toast.id, timeout)
      }
    })

    return () => {
      for (const [id, timeout] of toastTimeouts.entries()) {
        clearTimeout(timeout)
        toastTimeouts.delete(id)
      }
    }
  }, [state.toasts])

  const toast = (props) => {
    const id = genId()

    dispatch({
      type: ToastActionType.ADD_TOAST,
      toast: {
        ...props,
        id,
        open: true,
      },
    })

    return id
  }

  return (
    <ToastContext.Provider
      value={{
        toast,
        toasts: state.toasts,
        dismiss: (id) => {
          dispatch({
            type: ToastActionType.DISMISS_TOAST,
            id,
          })
        },
      }}
    >
      {children}
      <ToastProvider>
        {state.toasts.map(({ id, title, description, action, ...props }) => (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const { toast, dismiss } = React.useContext(ToastContext)

  return {
    toast: React.useCallback(
      (props) => {
        return toast(props)
      },
      [toast]
    ),
    dismiss: React.useCallback(
      (toastId) => {
        return dismiss(toastId)
      },
      [dismiss]
    ),
  }
}