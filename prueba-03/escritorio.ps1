# Pega una ventana al escritorio: queda sobre el fondo, debajo de las demás
# ventanas, y sobrevive a "Mostrar escritorio" (Win+D).
# Uso: powershell -File escritorio.ps1 <hwnd>
param([Int64]$hwnd)

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class Escritorio {
  [DllImport("user32.dll")] static extern IntPtr FindWindow(string c, string n);
  [DllImport("user32.dll")] static extern IntPtr SetWindowLongPtr(IntPtr h, int i, IntPtr v);
  [DllImport("user32.dll")] static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int cx, int cy, uint f);
  public static string Pegar(long w) {
    IntPtr h = new IntPtr(w);
    IntPtr progman = FindWindow("Progman", null);
    if (progman == IntPtr.Zero) return "sin Progman";
    // Dueño = escritorio: Win+D no la oculta.
    SetWindowLongPtr(h, -8 /* GWLP_HWNDPARENT */, progman);
    // Al fondo del orden de ventanas, sin moverla ni activarla.
    SetWindowPos(h, new IntPtr(1) /* HWND_BOTTOM */, 0, 0, 0, 0, 0x0001 | 0x0002 | 0x0010);
    return "ok";
  }
}
"@
[Escritorio]::Pegar($hwnd)
