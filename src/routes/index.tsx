import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import heroImg from "@/assets/hero-linen.jpg";
import cozinhaImg from "@/assets/room-cozinha.jpg";
import salaImg from "@/assets/room-sala.jpg";
import quartoImg from "@/assets/room-quarto.jpg";
import multiusoImg from "@/assets/room-multiuso.jpg";
import banheiroImg from "@/assets/room-banheiro.jpg";
import lavanderiaImg from "@/assets/room-lavanderia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maju & Pedro — Enxoval da Casa" },
      { name: "description", content: "O enxoval da casa da Maju e do Pedro, organizado por cômodo. Controle do que já temos, do que falta e do que queremos comprar." },
      { property: "og:title", content: "Maju & Pedro — Enxoval da Casa" },
      { property: "og:description", content: "O enxoval da casa da Maju e do Pedro, organizado por cômodo." },
    ],
  }),
  component: Index,
});

type Status = "temos" | "comprar";

type Item = {
  id: string;
  name: string;
  note?: string;
  status: Status;
};

type Room = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  items: Item[];
};
type SupabaseItem = {
  id: string;
  room_id: string;
  name: string;
  note?: string | null;
  status: Status;
};

const INITIAL_ROOMS: Room[] = [
  {
    id: "cozinha",
    name: "Cozinha",
    subtitle: "O coração da casa",
    image: cozinhaImg,
    items: [
      { id: "c1", name: "Geladeira", status: "comprar" },
      { id: "c2", name: "Cooktop", status: "temos" },
      { id: "c3", name: "Armário", status: "temos" },
      { id: "c4", name: "Micro-ondas", status: "temos" },
      { id: "c5", name: "Mesa", status: "comprar" },
      { id: "c6", name: "Jogo de panelas", status: "temos" },
      { id: "c7", name: "Liquidificador", status: "temos" },
      { id: "c8", name: "Panela de pressão", status: "temos" },
      { id: "c9", name: "Porta temperos", status: "temos" },
      { id: "c10", name: "Escorredor", status: "comprar" },
      { id: "c11", name: "Peneira", status: "comprar" },
      { id: "c12", name: "Jogo de talheres", status: "temos" },
      { id: "c13", name: "Jogo de copos", status: "temos" },
      { id: "c14", name: "Pratos", status: "comprar" },
      { id: "c15", name: "Panos de prato", status: "comprar" },
      { id: "c16", name: "Potes herméticos", status: "comprar" },
      { id: "c17", name: "Kit de utensílios", status: "temos" },
      { id: "c18", name: "Air fryer", status: "temos" },
      { id: "c19", name: "Batedeira", status: "comprar" },
      { id: "c20", name: "Tábua de cortar", status: "temos" },
      { id: "c21", name: "Xícaras", status: "comprar" },
      { id: "c22", name: "Lixeira", status: "comprar" },
      { id: "c23", name: "Kit de facas", status: "temos" },
    ],
  },
  {
    id: "sala",
    name: "Sala",
    subtitle: "Onde a vida acontece devagar",
    image: salaImg,
    items: [
      { id: "s1", name: "Sofá", status: "temos" },
      { id: "s2", name: "TV", status: "temos" },
      { id: "s3", name: "Painel de TV", status: "comprar" },
      { id: "s4", name: "Tapete", status: "comprar" },
      { id: "s5", name: "Decoração", status: "comprar" },
      { id: "s6", name: "Quadros", status: "comprar" },
      { id: "s7", name: "Enchimento de almofada", status: "comprar" },
      { id: "s8", name: "Capa de almofada", status: "comprar" },
      { id: "s9", name: "Manta de sofá", status: "comprar" },
      { id: "s10", name: "Mesa de centro", status: "comprar" },
      { id: "s11", name: "Cortina", status: "comprar" },
    ],
  },
  {
    id: "quarto",
    name: "Quarto do Casal",
    subtitle: "Nosso refúgio",
    image: quartoImg,
    items: [
      { id: "q1", name: "Jogos de cama", status: "temos" },
      { id: "q2", name: "Cobre-leitos", status: "temos" },
      { id: "q3", name: "Cortina", status: "temos" },
      { id: "q4", name: "Cama", status: "temos" },
      { id: "q5", name: "Guarda roupa", status: "temos" },
      { id: "q6", name: "Cabeceira", status: "comprar" },
      { id: "q7", name: "Mesa de cabeceira", status: "comprar" },
      { id: "q8", name: "Toalha de banho", status: "temos" },
      { id: "q9", name: "Toalha de rosto", status: "temos" },
      { id: "q10", name: "Cobertores", status: "temos" },
      { id: "q11", name: "Travesseiros", status: "temos" },
      { id: "q12", name: "Enchimento de almofada", status: "comprar" },
      { id: "q13", name: "Capa de almofada", status: "comprar" },
      { id: "q14", name: "Tapete", status: "temos" },
      { id: "q15", name: "Decoração", status: "comprar" },
    ],
  },
  {
    id: "multiuso",
    name: "Quarto Multiuso",
    subtitle: "Closet, ateliê de beleza e canto de trabalho",
    image: multiusoImg,
    items: [
      { id: "m1", name: "Guarda-roupa grande", status: "comprar" },
      { id: "m2", name: "Penteadeira", status: "comprar" },
      { id: "m3", name: "Espelho de corpo inteiro", status: "comprar" },
      { id: "m4", name: "Organizadores de maquiagem", status: "comprar" },
      { id: "m5", name: "Mesa de trabalho (home office)", status: "temos" },
      { id: "m6", name: "Cadeira ergonômica", status: "comprar" },
    ],
  },
  {
    id: "banheiro",
    name: "Banheiro",
    subtitle: "Pequenos rituais diários",
    image: banheiroImg,
    items: [
      { id: "b1", name: "Jogo de banheiro", status: "comprar" },
      { id: "b2", name: "Escova sanitária", status: "comprar" },
      { id: "b3", name: "Lixeira", status: "comprar" },
      { id: "b4", name: "Tapetes de banheiro", status: "temos" },
      { id: "b5", name: "Chuveiro", status: "temos" },
      { id: "b6", name: "Suporte de banheiro", status: "comprar" },
      { id: "b7", name: "Porta sabonete", status: "comprar" },
      { id: "b8", name: "Porta escova de dentes", status: "comprar" },
      { id: "b9", name: "Toalhas", status: "temos" },
      { id: "b10", name: "Espelho", status: "comprar" },
    ],
  },
  {
    id: "lavanderia",
    name: "Área de Serviço",
    subtitle: "Onde tudo se renova",
    image: lavanderiaImg,
    items: [
      { id: "l1", name: "Máquina de lavar", status: "comprar" },
      { id: "l2", name: "Aspirador de pó", status: "temos" },
      { id: "l3", name: "Prendedor de roupa", status: "comprar" },
      { id: "l4", name: "Porta prendedor de roupas", status: "temos" },
      { id: "l5", name: "Varal de roupas íntimas", status: "temos" },
      { id: "l6", name: "Vassoura", status: "comprar" },
      { id: "l7", name: "Pá de lixo", status: "comprar" },
      { id: "l8", name: "Rodo", status: "comprar" },
      { id: "l9", name: "Balde", status: "comprar" },
      { id: "l10", name: "Ferro de passar", status: "temos" },
      { id: "l11", name: "Mop", status: "temos" },
      { id: "l12", name: "Pano de chão", status: "comprar" },
      { id: "l13", name: "Tapete", status: "temos" },
    ],
  },
];



type Filter = "todos" | "temos" | "comprar";

const STATUS_LABEL: Record<Status, string> = {
  temos: "Temos",
  comprar: "Comprar",
};

const nextStatus = (s: Status): Status => (s === "temos" ? "comprar" : "temos");

function Index() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [activeRoom, setActiveRoom] = useState<string>("cozinha");
  const [filter, setFilter] = useState<Filter>("todos");
  const [hydrated, setHydrated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNote, setEditNote] = useState("");
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState<Status>("comprar");
  const [newNote, setNewNote] = useState("");
    function aplicarItensNosComodos(rows: SupabaseItem[]) {
    const roomsAtualizados = INITIAL_ROOMS.map((room) => {
      const itensDoComodo = rows
        .filter((row) => row.room_id === room.id)
        .map((row) => ({
          id: row.id,
          name: row.name,
          note: row.note ?? undefined,
          status: row.status,
        }));

      return {
        ...room,
        items: itensDoComodo,
      };
    });

    setRooms(roomsAtualizados);
  }

  async function carregarItensOnline() {
    const { data, error } = await supabase
      .from("enxoval_items")
      .select("id, room_id, name, note, status")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao carregar itens do Supabase:", error);
      alert("Não foi possível carregar os itens online.");
      return;
    }

    if (!data || data.length === 0) {
      await criarItensIniciaisOnline();
      return;
    }

    aplicarItensNosComodos(data as SupabaseItem[]);
  }

  async function criarItensIniciaisOnline() {
    const itensIniciais = INITIAL_ROOMS.flatMap((room) =>
      room.items.map((item) => ({
        id: item.id,
        room_id: room.id,
        name: item.name,
        note: item.note ?? null,
        status: item.status,
      }))
    );

    const { error } = await supabase
      .from("enxoval_items")
      .upsert(itensIniciais, { onConflict: "id" });

    if (error) {
      console.error("Erro ao criar itens iniciais:", error);
      alert("Não foi possível criar os itens iniciais online.");
      return;
    }

    await carregarItensOnline();
  }

  useEffect(() => {
    carregarItensOnline();
    setHydrated(true);

    const canal = supabase
      .channel("enxoval-online")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "enxoval_items",
        },
        () => {
          carregarItensOnline();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const totals = useMemo(() => {
    const all = rooms.flatMap((r) => r.items);
    const temos = all.filter((i) => i.status === "temos").length;
    const comprar = all.filter((i) => i.status === "comprar").length;
    return {
      temos,
      comprar,
      total: all.length,
      pct: all.length ? Math.round((temos / all.length) * 100) : 0,
    };
  }, [rooms]);

  const current = rooms.find((r) => r.id === activeRoom)!;
  const visibleItems = current.items.filter((it) =>
    filter === "todos" ? true : it.status === filter,
  );

    const cycleStatus = async (itemId: string) => {
    const itemAtual = current.items.find((item) => item.id === itemId);

    if (!itemAtual) return;

    const novoStatus = nextStatus(itemAtual.status);

    setRooms((prev) =>
      prev.map((r) =>
        r.id !== current.id
          ? r
          : {
              ...r,
              items: r.items.map((it) =>
                it.id === itemId ? { ...it, status: novoStatus } : it
              ),
            }
      )
    );

    const { error } = await supabase
      .from("enxoval_items")
      .update({
        status: novoStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Não foi possível atualizar o status online.");
      carregarItensOnline();
    }
  };

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setEditName(it.name);
    setEditNote(it.note ?? "");
  };

    const saveEdit = async () => {
    if (!editingId) return;

    const name = editName.trim();
    if (!name) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.id !== current.id
          ? r
          : {
              ...r,
              items: r.items.map((it) =>
                it.id === editingId
                  ? { ...it, name, note: editNote.trim() || undefined }
                  : it
              ),
            }
      )
    );

    const { error } = await supabase
      .from("enxoval_items")
      .update({
        name,
        note: editNote.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId);

    if (error) {
      console.error("Erro ao editar item:", error);
      alert("Não foi possível editar o item online.");
      carregarItensOnline();
      return;
    }

    setEditingId(null);
  };

    const deleteItem = async (itemId: string) => {
    const confirmar = confirm("Deseja realmente excluir este item?");

    if (!confirmar) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.id !== current.id
          ? r
          : { ...r, items: r.items.filter((it) => it.id !== itemId) }
      )
    );

    const { error } = await supabase
      .from("enxoval_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Erro ao excluir item:", error);
      alert("Não foi possível excluir o item online.");
      carregarItensOnline();
    }

    if (editingId === itemId) setEditingId(null);
  };

    const addItem = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = newName.trim();
    if (!name) return;

    const novoItem = {
      id: `${current.id}-${Date.now().toString(36)}`,
      room_id: current.id,
      name,
      status: newStatus,
      note: null,
    };

    setRooms((prev) =>
      prev.map((r) =>
        r.id !== current.id
          ? r
          : {
              ...r,
              items: [
                ...r.items,
                {
                  id: novoItem.id,
                  name: novoItem.name,
                  status: novoItem.status,
                },
              ],
            }
      )
    );

    const { error } = await supabase.from("enxoval_items").insert(novoItem);

    if (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Não foi possível adicionar o item online.");
      carregarItensOnline();
      return;
    }

    setNewName("");
    setNewNote("");
    setNewStatus("comprar");
  };

  const statusPill = (s: Status) =>
    s === "temos"
      ? "bg-foreground text-background border-foreground"
      : s === "comprar"
        ? "bg-card text-foreground border-foreground/40"
        : "border-foreground/20 text-foreground bg-transparent";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <span className="font-mono text-[10px] tracking-widest uppercase">Est. 2024</span>
        <div className="hidden md:flex gap-8 text-[11px] font-medium uppercase tracking-[0.2em]">
          <a href="#welcome" className="hover:text-muted-foreground transition-colors">Início</a>
          <a href="#inventario" className="hover:text-muted-foreground transition-colors">Inventário</a>
          <a href="#progresso" className="hover:text-muted-foreground transition-colors">Progresso</a>
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase">M&amp;P</span>
      </nav>

      {/* Hero */}
      <header className="relative flex flex-col items-center justify-center pt-24 pb-24 px-6 overflow-hidden">
        <div className="animate-[reveal-up_1.2s_var(--ease-out-expo)_both] flex flex-col items-center text-center">
          <span className="font-mono text-[11px] mb-8 tracking-[0.4em] uppercase text-muted-foreground opacity-80">
            Boas-vindas ao enxoval de
          </span>
          <h1 className="font-display italic tracking-tighter text-7xl md:text-9xl flex items-baseline gap-4 leading-none">
            Maju
            <span className="text-3xl md:text-5xl not-italic font-sans font-thin opacity-30">&amp;</span>
            Pedro
          </h1>
          <div className="mt-8 h-px bg-foreground/20 animate-[draw-line_1.5s_var(--ease-out-expo)_both] w-48" />
        </div>

        <div className="mt-16 w-full max-w-5xl animate-[reveal-up_1.4s_var(--ease-out-expo)_300ms_both]">
          <img
            src={heroImg}
            alt="Linho e algodão dobrados sobre a madeira"
            width={1536}
            height={1024}
            className="w-full aspect-[21/9] object-cover rounded-sm outline-1 -outline-offset-1 outline-foreground/5"
          />
        </div>
      </header>

      {/* Welcome */}
      <section id="welcome" className="max-w-2xl mx-auto px-6 py-24 border-t border-border">
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-display italic">Para a nossa casa</h2>
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
            Cada escolha aqui representa um pedacinho do lar que estamos construindo juntos.
  Entre itens que já conquistamos e outros que ainda virão, seguimos organizando
  com carinho tudo o que fará parte da nossa casa.
            <em> Temos</em> e <em>Comprar</em>, ou edite e adicione novos itens à vontade.
          </p>
          <p className="text-sm tracking-wide uppercase font-medium pt-4">Com amor, Maju &amp; Pedro</p>
        </div>
      </section>

      {/* Progresso global */}
      <section id="progresso" className="px-6 py-16 border-y border-border bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-6 gap-6 flex-wrap">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                Progresso geral
              </span>
              <h3 className="text-2xl font-display italic">
                {totals.temos} de {totals.total} itens reunidos
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                {totals.comprar} ainda para comprar
              </p>
            </div>
            <span className="font-display text-5xl md:text-6xl">{totals.pct}%</span>
          </div>
          <div className="h-px bg-foreground/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-700 ease-out"
              style={{ width: `${totals.pct}%` }}
            />
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-px bg-border">
            {rooms.map((r) => {
              const got = r.items.filter((i) => i.status === "temos").length;
              const pct = r.items.length ? Math.round((got / r.items.length) * 100) : 0;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRoom(r.id);
                    document.getElementById("inventario")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-background p-4 text-left hover:bg-card transition-colors"
                >
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {pct}%
                  </div>
                  <div className="font-display text-base mt-1">{r.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inventário */}
      <section id="inventario" className="px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Inventário por cômodo
              </span>
              <h2 className="text-4xl font-display">Lista da Casa</h2>
            </div>
          </div>

          {/* Room tabs */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-4 mb-12">
            {rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRoom(r.id);
                  setEditingId(null);
                }}
                className={`text-[11px] uppercase tracking-[0.2em] font-medium pb-1 border-b transition-colors ${
                  activeRoom === r.id
                    ? "text-foreground border-foreground"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* Active room */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5 md:sticky md:top-24">
              <img
                src={current.image}
                alt={current.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full aspect-square object-cover rounded-sm outline-1 -outline-offset-1 outline-foreground/5"
              />
              <div className="mt-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {String(rooms.findIndex((r) => r.id === current.id) + 1).padStart(3, "0")} /{" "}
                  {String(rooms.length).padStart(3, "0")}
                </span>
                <h3 className="font-display italic text-3xl mt-2">{current.name}</h3>
                <p className="text-muted-foreground mt-1">{current.subtitle}</p>
              </div>
            </div>

            <div className="md:col-span-7">
              {/* Filter */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {(["todos", "temos", "comprar"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-full border transition-colors ${
                      filter === f
                        ? "bg-foreground text-background border-foreground"
                        : "border-foreground/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "todos" ? "Todos" : f === "temos" ? "Já temos" : "Comprar"}
                  </button>
                ))}
                <span className="ml-auto font-mono text-[10px] text-muted-foreground uppercase">
                  {current.items.filter((i) => i.status === "temos").length} / {current.items.length}
                </span>
              </div>

              <ul className="divide-y divide-border border-y border-border">
                {visibleItems.map((it, idx) => (
                  <li key={it.id} className="group">
                    {editingId === it.id ? (
                      <div className="py-5 px-1 space-y-3">
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none font-display text-xl py-1"
                          placeholder="Nome do item"
                        />
                        <input
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="w-full bg-transparent border-b border-foreground/15 focus:border-foreground/60 outline-none text-sm py-1 text-muted-foreground"
                          placeholder="Observação (opcional)"
                        />
                        <div className="flex gap-3 pt-1">
                          <button
                            onClick={saveEdit}
                            className="px-4 py-1.5 text-[10px] uppercase tracking-widest bg-foreground text-background rounded-full"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-1.5 text-[10px] uppercase tracking-widest border border-foreground/20 rounded-full"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => deleteItem(it.id)}
                            className="ml-auto px-4 py-1.5 text-[10px] uppercase tracking-widest border border-foreground/20 rounded-full text-muted-foreground hover:text-foreground"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 py-5 px-1 hover:bg-card transition-colors">
                        <span className="font-mono text-[10px] text-muted-foreground w-8 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-display text-xl transition-all ${
                              it.status === "temos" ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {it.name}
                          </div>
                          {it.note && (
                            <div className="text-xs text-muted-foreground mt-1 font-mono">{it.note}</div>
                          )}
                        </div>
                        <button
                          onClick={() => cycleStatus(it.id)}
                          title="Alternar status"
                          className={`px-3 py-1 text-[9px] uppercase tracking-wider rounded-full border shrink-0 transition-colors ${statusPill(
                            it.status,
                          )}`}
                        >
                          {STATUS_LABEL[it.status]}
                        </button>
                        <button
                          onClick={() => startEdit(it)}
                          className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground shrink-0"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                  </li>
                ))}
                {visibleItems.length === 0 && (
                  <li className="py-12 text-center text-muted-foreground font-display italic text-xl">
                    Nada por aqui neste filtro.
                  </li>
                )}
              </ul>

              {/* Add new item — editorial ledger entry */}
              <form onSubmit={addItem} className="mt-16 flex flex-col gap-8">
                <div className="flex items-end justify-between border-b border-border pb-2">
                  <h3 className="font-display italic text-2xl text-foreground">
                    Adicionar item
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Novo registro · {current.name}
                  </span>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Nome do item
                  </label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex.: Toalhas de linho…"
                    className="w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground transition-colors text-foreground placeholder:text-muted-foreground/60 italic font-sans"
                  />
                </div>


                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                    Status do inventário
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["temos", "comprar"] as Status[]).map((s) => {
                      const active = newStatus === s;
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setNewStatus(s)}
                          className={`px-3 py-1.5 border font-mono text-[11px] uppercase tracking-wider transition-all ${
                            active
                              ? "border-foreground text-foreground bg-muted"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {STATUS_LABEL[s]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full bg-foreground text-background py-4 font-display italic text-lg hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  Adicionar ao arquivo
                </button>

                <div className="flex justify-center">
                  <div className="w-8 h-px bg-border" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-border flex flex-col items-center gap-12">
        <div className="text-center">
          <h2 className="font-display italic text-4xl mb-4">Maju &amp; Pedro</h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Construído com carinho • Nosso lar
          </p>
        </div>
        <div className="w-px h-24 bg-foreground/10" />
        <div className="flex gap-12">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground text-center">
            Toque no rótulo para alternar entre Temos · Comprar
          </span>
        </div>
      </footer>
    </div>
  );
}
