type Metric = {
  label: string;
  value:
    | string
    | number;
  detail?: string;
};

export default function AdminMetricStrip({
  metrics,
}: {
  metrics: Metric[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr">
        {metrics.map(
          (
            metric,
            index
          ) => (
            <div
              key={
                metric.label
              }
              className={[
                "min-w-0 px-4 py-4 sm:px-5",
                "border-b border-r border-[#284239]/10",
                index % 2 === 1
                  ? "border-r-0 sm:border-r"
                  : "",
                "lg:border-b-0",
                index ===
                metrics.length -
                  1
                  ? "lg:border-r-0"
                  : "",
              ].join(" ")}
            >
              <p className="break-words text-[11px] font-semibold uppercase leading-4 tracking-[0.1em] text-[#718078] sm:text-xs">
                {
                  metric.label
                }
              </p>

              <p className="mt-1 break-words text-2xl font-semibold tracking-tight text-[#153f32]">
                {
                  metric.value
                }
              </p>

              {metric.detail && (
                <p className="mt-1 text-xs leading-5 text-[#8a958f]">
                  {
                    metric.detail
                  }
                </p>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
