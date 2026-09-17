"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Heart, Home, RotateCcw, Sparkles, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Option = { value: string; label: string; description: string };
type ModelContext = { registerTool: (tool: object, options?: { signal?: AbortSignal }) => void | Promise<void> };
declare global { interface Document { readonly modelContext?: ModelContext } }
const topics = [
  { value: "金錢與接收", label: "金錢與接收", description: "付出很多，卻難以安心接受回報", icon: WalletCards },
  { value: "親密關係", label: "親密關係", description: "重複遇見相似的距離、失望或責任", icon: Heart },
  { value: "父母與家庭", label: "父母與家庭", description: "想理解家中的角色、期待與未說出的感受", icon: Home },
  { value: "工作與價值", label: "工作與價值", description: "努力未被看見，或常懷疑自己的選擇", icon: BriefcaseBusiness },
];
const feelings: Option[] = [
  { value: "委屈", label: "委屈", description: "我已經很努力，卻仍不被理解" },
  { value: "憤怒", label: "憤怒", description: "我的界線或需要沒有被尊重" },
  { value: "害怕", label: "害怕", description: "擔心失去關係、安全感或機會" },
  { value: "內疚", label: "內疚", description: "為自己選擇時，感到對不起別人" },
];
const patterns: Option[] = [
  { value: "過度承擔", label: "過度承擔", description: "習慣先照顧別人，把自己的需要放到最後" },
  { value: "尋求認同", label: "尋求認同", description: "對方的反應，容易變成我對自我價值的判斷" },
  { value: "難以設界線", label: "難以設界線", description: "明明不願意，仍怕拒絕會破壞關係" },
  { value: "重複熟悉模式", label: "重複熟悉模式", description: "在不同關係中，再次進入相似的位置" },
];
const beliefs: Option[] = [
  { value: "只有付出才值得被愛", label: "只有付出，才值得被愛", description: "把被需要誤當成被愛" },
  { value: "拒絕會令我失去關係", label: "拒絕，會令我失去關係", description: "界線被理解成離開或傷害" },
  { value: "別人的需要比我重要", label: "別人的需要，比我的重要", description: "自己的感受總要再等一等" },
  { value: "沒有結果代表我沒有價值", label: "沒有結果，代表我沒有價值", description: "把暫時的結果等同自己的價值" },
];
const stepMeta = [
  { eyebrow: "第一步 · 定位", title: "此刻，你最想看清哪一個主題？", note: "不用選最嚴重的，只選最近最有感覺的一個。" },
  { eyebrow: "第二步 · 感受", title: "當事情發生，你最先感受到甚麼？", note: "先承認感受，不急着分析誰對誰錯。" },
  { eyebrow: "第三步 · 模式", title: "你通常會站在哪一個位置？", note: "留意這是否是你在不同關係中熟悉的位置。" },
  { eyebrow: "第四步 · 信念", title: "哪一句話最像你內心的規則？", note: "信念不一定是事實，只是你曾用來保護自己的方法。" },
];

function ChoiceList({ options, value, onChange, topic = false }: { options: Option[] | typeof topics; value: string; onChange: (value: string) => void; topic?: boolean }) {
  return <RadioGroup value={value} onValueChange={onChange} className={topic ? "grid gap-3 md:grid-cols-2" : "grid gap-3"}>
    {options.map((option) => {
      const Icon = "icon" in option ? option.icon : null;
      const selected = value === option.value;
      return <label key={option.value} className={`group flex cursor-pointer items-start gap-4 rounded-[1.25rem] border p-4 transition-all sm:p-5 ${selected ? "border-[#9d8fff] bg-[#272247] shadow-[0_14px_40px_rgba(8,5,22,.28)]" : "border-white/10 bg-white/[.045] hover:border-white/20 hover:bg-white/[.07]"}`}>
        <RadioGroupItem value={option.value} className="mt-1 border-white/35 text-[#c8bdff] data-[state=checked]:border-[#b8aaff]" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[1rem] font-semibold text-white">{Icon ? <Icon className="size-4.5 text-[#b8aaff]" aria-hidden="true" /> : null}{option.label}</span>
          <span className="mt-1.5 block text-[.9rem] leading-6 text-[#b8b3ca]">{option.description}</span>
        </span>
      </label>;
    })}
  </RadioGroup>;
}

export default function HomePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ topic: "", feeling: "", pattern: "", belief: "" });
  const currentValue = [answers.topic, answers.feeling, answers.pattern, answers.belief][step] ?? "";
  const reflection = useMemo(() => ({
    observation: `當「${answers.topic}」被觸發時，你可能先感到${answers.feeling}，然後習慣進入「${answers.pattern}」的位置。`,
    distinction: `「${answers.belief}」是一個值得被看見的內在規則，但它不等於此刻全部的事實。`,
    action: answers.pattern === "難以設界線" ? "先用一句不解釋、不指責的話表達自己的界線。" : "在下一次自動反應前，先停十秒，問自己：這次我真正願意承擔多少？",
  }), [answers]);
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const allowed = {
      topic: topics.map((item) => item.value),
      feeling: feelings.map((item) => item.value),
      pattern: patterns.map((item) => item.value),
      belief: beliefs.map((item) => item.value),
    };
    void Promise.resolve(context.registerTool({
      name: "complete_self_exploration",
      title: "完成自我探索",
      description: "以四個已選答案完成家庭系統自我探索，並在頁面顯示摘要。",
      inputSchema: {
        type: "object",
        properties: Object.fromEntries(Object.entries(allowed).map(([key, values]) => [key, { type: "string", enum: values }])),
        required: ["topic", "feeling", "pattern", "belief"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        if (!input || typeof input !== "object") throw new Error("請提供完整探索答案");
        const next = input as Record<string, string>;
        for (const [key, values] of Object.entries(allowed)) if (!values.includes(next[key])) throw new Error(`${key} 的選項無效`);
        const completed = { topic: next.topic, feeling: next.feeling, pattern: next.pattern, belief: next.belief };
        setAnswers(completed);
        setStep(4);
        return { status: "completed", answers: completed };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  function update(value: string) {
    const keys = ["topic", "feeling", "pattern", "belief"] as const;
    setAnswers((prev) => ({ ...prev, [keys[step]]: value }));
  }
  function reset() { setStep(0); setAnswers({ topic: "", feeling: "", pattern: "", belief: "" }); }

  return <main className="relative min-h-screen overflow-hidden bg-[#0d0b18] text-white">
    <div className="field-glow field-glow-one" aria-hidden="true" /><div className="field-glow field-glow-two" aria-hidden="true" />
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full border border-[#b9adff]/35 bg-[#8170ef]/15"><Sparkles className="size-4 text-[#c9c0ff]" aria-hidden="true" /></span><div><p className="text-sm font-semibold tracking-[.04em]">家庭系統自我探索工具</p><p className="text-xs text-[#8f899f]">看見模式，重新選擇</p></div></div>
      {step > 0 ? <button onClick={reset} className="flex min-h-10 items-center gap-2 rounded-full px-3 text-sm text-[#aaa4ba] transition hover:bg-white/5 hover:text-white"><RotateCcw className="size-4" aria-hidden="true" />重新開始</button> : null}
    </header>
    <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 pb-10 pt-4 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(20rem,32rem)] md:items-center md:pb-16 md:pt-10">
      <div className="max-w-xl md:pb-16">
        <p className="mb-4 text-sm font-semibold tracking-[.14em] text-[#a99cff]">A QUIET SPACE FOR YOURSELF</p>
        <h1 className="text-balance text-[clamp(2.35rem,6vw,4.85rem)] font-medium leading-[1.03] tracking-[-.055em]">有些重複，<br /><span className="text-[#b6aaff]">不是你的錯。</span></h1>
        <p className="mt-6 max-w-lg text-[1.05rem] leading-8 text-[#aaa5b9]">用幾分鐘整理一個困擾你的情境，分開感受、家庭經驗與現實選擇。答案不替你下定論，只幫你把內在聲音看得更清楚。</p>
        <div className="mt-9 hidden gap-8 md:flex"><div><p className="text-2xl font-medium">4</p><p className="mt-1 text-sm text-[#898396]">個探索層次</p></div><div className="h-12 w-px bg-white/10" /><div><p className="text-2xl font-medium">5–8</p><p className="mt-1 text-sm text-[#898396]">分鐘完成</p></div><div className="h-12 w-px bg-white/10" /><div><p className="text-2xl font-medium">0</p><p className="mt-1 text-sm text-[#898396]">個人資料上載</p></div></div>
      </div>
      <div className="relative rounded-[1.75rem] border border-white/10 bg-[#171326]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,.38)] backdrop-blur-xl sm:p-7">
        {step < 4 ? <>
          <div className="mb-7 flex items-center gap-4"><Progress value={(step + 1) * 25} className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-[#9f91ff]" aria-label={`進度 ${(step + 1) * 25}%`} /><span className="shrink-0 text-xs font-medium text-[#8f899f]">{step + 1} / 4</span></div>
          <p className="text-xs font-semibold tracking-[.12em] text-[#9e91ef]">{stepMeta[step].eyebrow}</p><h2 className="mt-3 text-balance text-[1.65rem] font-medium leading-tight tracking-[-.025em]">{stepMeta[step].title}</h2><p className="mb-6 mt-2 text-sm leading-6 text-[#9892a7]">{stepMeta[step].note}</p>
          {step === 0 ? <ChoiceList options={topics} value={answers.topic} onChange={update} topic /> : null}{step === 1 ? <ChoiceList options={feelings} value={answers.feeling} onChange={update} /> : null}{step === 2 ? <ChoiceList options={patterns} value={answers.pattern} onChange={update} /> : null}{step === 3 ? <ChoiceList options={beliefs} value={answers.belief} onChange={update} /> : null}
          <div className="mt-7 flex items-center justify-between gap-3"><Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="h-11 rounded-full px-4 text-[#aaa4ba] hover:bg-white/5 hover:text-white"><ArrowLeft aria-hidden="true" />上一步</Button><Button onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={!currentValue} className="h-11 rounded-full bg-[#a394ff] px-5 text-[#171126] hover:bg-[#b5a9ff]">{step === 3 ? "整理我的探索" : "下一步"}<ArrowRight aria-hidden="true" /></Button></div>
        </> : <div aria-live="polite">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#a394ff]/15 text-[#b9afff]"><Sparkles className="size-5" aria-hidden="true" /></span><p className="mt-5 text-xs font-semibold tracking-[.12em] text-[#9e91ef]">你的探索摘要</p><h2 className="mt-3 text-2xl font-medium tracking-[-.025em]">你正在看見一個熟悉的模式</h2>
          <div className="mt-6 space-y-3"><div className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><p className="text-xs font-semibold tracking-[.1em] text-[#9186dc]">01 · 觀察</p><p className="mt-2 leading-7 text-[#d1ccda]">{reflection.observation}</p></div><div className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><p className="text-xs font-semibold tracking-[.1em] text-[#9186dc]">02 · 分開事實與信念</p><p className="mt-2 leading-7 text-[#d1ccda]">{reflection.distinction}</p></div><div className="rounded-2xl border border-[#a394ff]/30 bg-[#7969da]/10 p-4"><p className="text-xs font-semibold tracking-[.1em] text-[#b4a8ff]">03 · 一個小行動</p><p className="mt-2 leading-7">{reflection.action}</p></div></div>
          <blockquote className="mt-6 border-l-2 border-[#9e91ef] pl-4 text-[.95rem] italic leading-7 text-[#aaa5b9]">「我可以尊重過去的經驗，也可以為現在的自己，選擇一個新的位置。」</blockquote><Button onClick={reset} className="mt-7 h-11 w-full rounded-full bg-[#a394ff] text-[#171126] hover:bg-[#b5a9ff]">再探索另一個主題</Button>
        </div>}
      </div>
    </section>
    <footer className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-white/8 px-5 py-6 text-xs leading-5 text-[#777184] sm:px-8 md:flex-row md:items-center md:justify-between"><p>這是自我覺察工具，不提供心理診斷或治療。</p><p>若感到持續困擾或不安全，請尋求合資格專業人士協助。</p></footer>
  </main>;
}
